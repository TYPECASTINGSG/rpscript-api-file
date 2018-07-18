import {expect} from 'chai';
import m from 'mocha';

import { RpsContext } from 'rpscript-interface';
import RpsFile from '../src/index';

m.describe('File', () => {

  m.it('should create, append, delete file', async function() {
    let ctx = new RpsContext
    let file = new RpsFile;
    let pathDirectory = "./test/tempfilename.txt";
    let content = "Hello";

    await file.write(ctx,{},pathDirectory);
    let exist = await file.exists(ctx,{},pathDirectory);

    expect(exist).to.be.true; //file exist

    await file.append(ctx,{},pathDirectory, content);
    let output = await file.read(ctx,{},pathDirectory);

    expect(output).to.contains(content);  //content is written

    await file.delete(ctx,{},pathDirectory);
    exist = await file.exists(ctx,{},pathDirectory);

    expect(exist).to.be.false;    //removed
  });

  m.it('should create, append, delete file with object type', async function() {
    let ctx = new RpsContext
    let file = new RpsFile;
    let pathDirectory = "./test/tempfilename1.txt";
    let content = {a:1,b:'bb',c:{d:2,e:'ee'}};

    await file.write(ctx,{},pathDirectory);
    let exist = await file.exists(ctx,{},pathDirectory);

    expect(exist).to.be.true; //file exist

    await file.append(ctx,{},pathDirectory, content);
    let output = await file.read(ctx,{},pathDirectory);

    expect(output).to.be.deep.equals(content);  //content is written

    await file.delete(ctx,{},pathDirectory);
    exist = await file.exists(ctx,{},pathDirectory);

    expect(exist).to.be.false;    //removed
  });

  m.it('should create, append, delete file with array primitive type', async function() {
    let ctx = new RpsContext
    let file = new RpsFile;
    let pathDirectory = "./test/tempfilename2.txt";
    let content = ['a','b',1,'d'];
    
    await file.write(ctx,{},pathDirectory);
    let exist = await file.exists(ctx,{},pathDirectory);

    expect(exist).to.be.true; //file exist

    await file.append(ctx,{},pathDirectory, content);
    let output = await file.read(ctx,{},pathDirectory);

    expect(output).to.be.deep.equals(content);  //content is written

    await file.delete(ctx,{},pathDirectory);
    exist = await file.exists(ctx,{},pathDirectory);

    expect(exist).to.be.false;    //removed
  });

  m.it('should create, append, delete file with array object type', async function() {
    let ctx = new RpsContext
    let file = new RpsFile;
    let pathDirectory = "./test/tempfilename3.txt";
    let content = [{a:1,b:'bb',c:{d:2,e:'ee'}},{a:5,b:'ww',c:{d:3,e:'ff'}}];
    
    await file.write(ctx,{},pathDirectory);
    let exist = await file.exists(ctx,{},pathDirectory);

    expect(exist).to.be.true; //file exist

    await file.append(ctx,{},pathDirectory, content);
    let output = await file.read(ctx,{},pathDirectory);

    expect(output).to.be.deep.equals(content);  //content is written

    await file.delete(ctx,{},pathDirectory);
    exist = await file.exists(ctx,{},pathDirectory);

    expect(exist).to.be.false;    //removed
  });

  m.it('should create, append, delete file with function type', async function() {
    let ctx = new RpsContext
    let file = new RpsFile;
    let pathDirectory = "./test/tempfilename4.txt";
    let content = function(){console.log('hello');};
    
    await file.write(ctx,{},pathDirectory);
    let exist = await file.exists(ctx,{},pathDirectory);

    expect(exist).to.be.true; //file exist

    await file.append(ctx,{},pathDirectory, content);
    let output = await file.read(ctx,{},pathDirectory);

    expect(output).contains('function')

    await file.delete(ctx,{},pathDirectory);
    exist = await file.exists(ctx,{},pathDirectory);

    expect(exist).to.be.false;    //removed
  });

})
