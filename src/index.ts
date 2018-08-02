import {RpsContext,RpsModule,rpsAction,R} from 'rpscript-interface';
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
 * @return {string}
 * read-file 'file.txt'
 * 
 * @returns {string}
 * @summary read-file :: String → String
 * 
*/
  @rpsAction({verbName:'read-file'})
  async read(ctx:RpsContext, opts:{}, filepath:string) : Promise<string>{
      return this.parseReadContent(fs.readFileSync(filepath,'utf8'));
  }

/**
 * @function append-to-file
 * @memberof File
 * @param {string} filepath path to be read from
 * @param {string} content The content to append to
 * @return {void}
 * 
 * @summary read-file :: String → String → void
 * 
*/
  @rpsAction({verbName:'append-to-file'})
  async append(ctx:RpsContext, opts:{}, ...params:any[]) : Promise<void|Function>{
    var that = this;
    // filepath?:string, content?:any
    let fn = R.curry(function (filepath,content) {
      content = that.parseWriteContent(content);
      fs.appendFileSync(filepath,content,'utf8');
    });

    return R.apply(fn,params);
  }

  /**
 * @function write-file
 * @memberof File
 * @param {string} filepath path to be read from
 * @param {string} content The content to append to
 * @return {void}
 * 
 * @summary write-file :: String → String → void
 * 
*/
  @rpsAction({verbName:'write-file'})
  async write (ctx:RpsContext, opts:{},filepath:string, content?:any) : Promise<void> {
    // var that = this;
    // let fn = R.curry(function(filepath,content){
    //   content = that.parseWriteContent(content);
    //   fs.writeFileSync(filepath,content,'utf8');
    // });
    // return R.apply(fn,params);

    content = this.parseWriteContent(content);
    fs.writeFileSync(filepath,content,'utf8');
  }

/**
 * @function delete-file
 * @memberof File
 * @param {string} filepath path to be read from
 * @return {void}
 * 
 * @summary delete-file :: String → void
 * 
*/
  @rpsAction({verbName:'delete-file'})
  async delete (ctx:RpsContext, opts:{}, filename:string) : Promise<void> {
    return fs.unlinkSync(filename);
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
 * @summary file-exists :: String → Boolean
 * 
*/
  @rpsAction({verbName:'file-exists'})
  async exists (ctx:RpsContext, opts:{}, filepath:string) : Promise<boolean> {
    return fs.existsSync(filepath);
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
 * log file-exists 'name.txt'
 * 
 * @summary delete-file :: String → String → void
 * 
 * 
*/
  @rpsAction({verbName:'rename-file'})
  async rename (ctx:RpsContext, opts:{}, oldpath:string, newpath?:string) : Promise<void|Function> {
      if(newpath)
        return fs.renameSync(oldpath,newpath);
      else
        return function(newpath){fs.renameSync(oldpath,newpath);}
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
 * @summary file-stat :: String → fs.Stats
 * 
*/
  @rpsAction({verbName:'file-stat'})
  async stat (ctx:RpsContext, opts:{}, filepath:string) : Promise<fs.Stats> {
      return fs.statSync(filepath);
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


