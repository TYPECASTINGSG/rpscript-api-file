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
  async read(ctx:RpsContext, opts:{}, filepath?:string) : Promise<string|Function>{
    if(filepath)
      return this.parseReadContent(fs.readFileSync(filepath,'utf8'));
    else  
      return function(filepath){return this.parseReadContent(fs.readFileSync(filepath,'utf8'));}
  }

/**
 * @function append-to-file
 * @memberof File
 * @param {string} filepath path to be read from
 * @param {string} content The content to append to
 * @return {void}
 * 
 * @summary append-to-file :: String → String → void
 * 
*/
  @rpsAction({verbName:'append-to-file'})
  async append(ctx:RpsContext, opts:{}, ...params:any[]) : Promise<void|Function>{
    var that = this;
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
 * @param {string} content The content to write
 * @return {void}
 * 
 * @summary write-file :: String → String → void
 * 
*/
  @rpsAction({verbName:'write-file'})
  async write (ctx:RpsContext, opts:{},...params:any[]) : Promise<void|Function> {
    // filepath:string, content?:any
    var that = this;
    let fn = R.curry(function(filepath,content){
      content = that.parseWriteContent(content);
      fs.writeFileSync(filepath,content,'utf8');
    });

    return R.apply(fn,params);
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
  async delete (ctx:RpsContext, opts:{}, filename?:string) : Promise<void|Function> {
    if(filename) return fs.unlinkSync(filename);
    else return function(fn){ fs.unlinkSync(fn); }
  }

  /**
 * @function file-exists
 * @memberof File
 * @param {string} filepath path to check if exists
 * @return {boolean}
 * 
 * @example
 * write-file 'file.txt' ''
 * ;Print out true
 * log file-exists 'file.txt'
 * delete-file 'file.txt'
 * ;Print out false
 * log file-exists 'file.txt'
 * 
 * @summary file-exists :: String → Boolean
 * 
*/
  @rpsAction({verbName:'file-exists'})
  async exists (ctx:RpsContext, opts:{}, filepath:string) : Promise<boolean|Function> {
    if(filepath) return fs.existsSync(filepath);
    else return function(fp){ return fs.existsSync(fp); }
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
 * @summary rename-file :: String → String → void
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
 * log $RESULT
 * 
 * @summary file-stat :: String → fs.Stats
 * 
*/
  @rpsAction({verbName:'file-stat'})
  async stat (ctx:RpsContext, opts:{}, filepath:string) : Promise<fs.Stats|Function> {
    if(filepath) return fs.statSync(filepath);
    else return function(fp){ return fs.statSync(fp); }
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


