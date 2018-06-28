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

})
