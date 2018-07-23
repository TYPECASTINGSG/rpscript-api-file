import {RpsContext,RpsModule,rpsAction} from 'rpscript-interface';
import fs from 'fs';

/** Module for parsing file management
 * @namespace File
 * @example
 * rps install file
*/
@RpsModule("file")
export default class RpsFile {

  /**
 * @function read-file
 * @memberof File
 * @param {string} filepath path to be read from
 * @return {string|Object|Array}
 * @description
 * If the file is in object or array format, it will be casted. Else it will be in string format
 * 
 * @example
 * read-file 'file.txt'
 * ;Print output to the console
 * console-log $RESULT
 * 
 * 
*/
  @rpsAction({verbName:'read-file'})
  read(ctx:RpsContext, opts:{}, filepath:string) : Promise<string>{
    return new Promise((resolve, reject) => {
      fs.readFile(filepath,'utf8',(err,data) =>
      {
        if(err) reject(err);
        else resolve( this.parseReadContent(data) );
      });
    });
  }

/**
 * @function append-to-file
 * @memberof File
 * @param {string} filepath path to be read from
 * @param {string} content The content to append to
 * @return {void}
 * 
 * @example
 * read-file 'file.txt'
 * ;Print output to the console
 * console-log $RESULT
 * 
 * 
*/
  @rpsAction({verbName:'append-to-file'})
  append(ctx:RpsContext, opts:{}, filepath:string, content:any) : Promise<void>{
    content = this.parseWriteContent(content);

    return new Promise((resolve, reject) => {
      fs.appendFile(filepath,content,'utf8',(err) =>
      {
        if(err) reject(err);
        else resolve();
      });
    });
  }

  /**
 * @function write-file
 * @memberof File
 * @param {string} filepath path to be read from
 * @param {string} content The content to append to
 * @return {void}
 * 
 * @example
 * read-file 'file.txt'
 * ;Print output to the console
 * console-log $RESULT
 * 
 * 
*/
  @rpsAction({verbName:'write-file'})
  write (ctx:RpsContext, opts:{}, filepath:string, content?:any) : Promise<void> {
    content = this.parseWriteContent(content);
  
    return new Promise((resolve, reject) => {
      fs.writeFile(filepath,content,'utf8',(err) => {
        if(err) reject(err);
        else resolve();
      });
    });
  }

/**
 * @function delete-file
 * @memberof File
 * @param {string} filepath path to be read from
 * @return {void}
 * 
 * @example
 * delete-file 'file.txt'
 * ;Print out false
 * console-log file-exists 'file.txt'
 * 
 * 
*/
  @rpsAction({verbName:'delete-file'})
  delete (ctx:RpsContext, opts:{}, filename:string) : Promise<void> {

    return new Promise((resolve, reject) => {
      fs.unlink(filename,(err) =>
      {
        if(err) reject(err);
        else resolve();
      });
    });
  }

  /**
 * @function file-exists
 * @memberof File
 * @param {string} filepath path to check if exists
 * @return {boolean}
 * 
 * @example
 * write-file 'file.txt'
 * ;Print out true
 * console-log file-exists 'file.txt'
 * delete-file 'file.txt'
 * ;Print out false
 * console-log file-exists 'file.txt'
 * 
 * 
*/
  @rpsAction({verbName:'file-exists'})
  exists (ctx:RpsContext, opts:{}, filepath:string) : Promise<boolean> {
    return Promise.resolve(fs.existsSync(filepath));
  }

/**
 * @function rename-file
 * @memberof File
 * @param {string} oldpath file to be changed
 * @param {string} newpath new path of the file
 * @return {void}
 * @description
 * rename the current file
 * 
 * @example
 * rename-file 'file.txt' 'name.txt'
 * console-log file-exists 'name.txt'
 * 
 * 
*/
  @rpsAction({verbName:'rename-file'})
  rename (ctx:RpsContext, opts:{}, oldpath:string, newpath:string) : Promise<void> {
    return new Promise((resolve, reject) => {
      fs.rename(oldpath,newpath,(err) =>
      {
        if(err) reject(err);
        else resolve();
      });
    });
  }
  
/**
 * @function file-stat
 * @memberof File
 * @param {string} filepath 
 * @return {Stats}
 * @description
 * provide the stats of the file
 * 
 * @example
 * file-stat 'file.txt'
 * console-log $RESULT
 * 
 * 
*/
  @rpsAction({verbName:'file-stat'})
  stat (ctx:RpsContext, opts:{}, filepath:string) : Promise<fs.Stats> {
    return new Promise((resolve, reject) => {
      fs.stat(filepath,(err, stats) =>
      {
        if(err) reject(err);
        else resolve(stats);
      });
    });
  }

  parseWriteContent (content:any) :string{
    if(typeof content === 'string') return content;
    else if(typeof content === 'undefined') return '';
    else if(typeof content === 'function') return content;
    else if(typeof content === 'object') return JSON.stringify(content,null,2);
    else return content;
  }

  parseReadContent (content:string) :any{
    let result;
    try{
      result = JSON.parse(content);
    }catch(err){
      result = content;
    }
    return result;
  }
}


