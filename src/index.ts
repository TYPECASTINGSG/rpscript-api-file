/**
 * @module File
 */
import {RpsContext,RpsModule,rpsAction} from 'rpscript-interface';
import fs from 'fs';

@RpsModule("file")
export default class RpsFile {

  @rpsAction({defaultName:'read'})
  read(ctx:RpsContext, opts:{}, filepath:string) : Promise<string>{
    return new Promise((resolve, reject) => {
      fs.readFile(filepath,'utf8',(err,data) =>
      {
        if(err) reject(err);
        else resolve(data);
      });
    });
  }

  @rpsAction({defaultName:'append'})
  append(ctx:RpsContext, opts:{}, filename:string, content:string) : Promise<void>{
    return new Promise((resolve, reject) => {
      fs.appendFile(filename,content,'utf8',(err) =>
      {
        if(err) reject(err);
        else resolve();
      });
    });
  }

  @rpsAction({defaultName:'write'})
  write (ctx:RpsContext, opts:{}, filename:string, content?:string) : Promise<void> {
    if(!content) content = '';
  
    return new Promise((resolve, reject) => {
      fs.writeFile(filename,content,'utf8',(err) => {
        if(err) reject(err);
        else resolve();
      });
    });
  }

  @rpsAction({defaultName:'delete'})
  delete (ctx:RpsContext, opts:{}, filename:string) : Promise<void> {

    return new Promise((resolve, reject) => {
      fs.unlink(filename,(err) =>
      {
        if(err) reject(err);
        else resolve();
      });
    });
  }

  @rpsAction({defaultName:'exists'})
  exists (ctx:RpsContext, opts:{}, filepath:string) : Promise<boolean> {
    return Promise.resolve(fs.existsSync(filepath));
  }

  @rpsAction({defaultName:'rename'})
  rename (ctx:RpsContext, opts:{}, oldpath:string, newpath:string) : Promise<void> {
    return new Promise((resolve, reject) => {
      fs.rename(oldpath,newpath,(err) =>
      {
        if(err) reject(err);
        else resolve();
      });
    });
  }
  
  @rpsAction({defaultName:'stat'})
  stat (ctx:RpsContext, opts:{}, filepath:string) : Promise<fs.Stats> {
    return new Promise((resolve, reject) => {
      fs.stat(filepath,(err, stats) =>
      {
        if(err) reject(err);
        else resolve(stats);
      });
    });
  }
}


