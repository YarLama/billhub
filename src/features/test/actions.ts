'use server';

import { decryptDekWithMaster, decryptPassword, encryptDekWithMaster, encryptPassword, generateRandomDek } from "@/shared/lib/crypto";
import { serverStorage } from "@/shared/lib/storage";

export async function runTestCrypto() {
  try {
    const pass = "password1234-4321";
    const masterPass = "9876";
    const newDek = generateRandomDek();
    const eDek = await encryptDekWithMaster(newDek, masterPass);
    const ePass = await encryptPassword(pass, newDek);
    const dDek = await decryptDekWithMaster(eDek,masterPass)
    const dPass = await decryptPassword(ePass, dDek);
  } catch(e) {
    console.error(`Tests error: ${e}`);
  }
}

export async function runTestStorage() {
  try {
    console.log('------start test storage------');
    const testJson1 = {
      user: "user@mail.ru",
      host: "host.mail.ru"
    };
    const testJson2 = {
      data: [
        { id: '123'},
        { id: '321'}
      ]
    };
    const testPath1 = "testconfig.json";
    const testPath2 = "test/testconfig.json";
    const testPath3 = "testfile.txt";
    const text = Buffer.from("Test text message, фыв", 'utf-8');

    console.log('1. test save json');
    await serverStorage.saveJson(testPath1, testJson1);
    console.log(`Записан: ${testPath1}`);
    await serverStorage.saveJson(testPath2, testJson2);
    console.log(`Записан: ${testPath2}`);

    console.log('2. test read json');
    const readJson1 = await serverStorage.readJson<typeof testJson1>(testPath1);
    console.log(`Read ${testPath1}: ${readJson1}`);
    const readJson2 = await serverStorage.readJson<typeof testJson2>(testPath2);
    console.log(`Read ${testPath2}: ${readJson2}`);

    console.log('3. test save file');
    await serverStorage.saveFile(testPath3, text);
    console.log(`Записан: ${testPath3}`);


    console.log('4. test read file');
    const readFile = await serverStorage.readFile(testPath3);
    console.log(`Read ${testPath3}: ${readFile}`);

    return {success: true, message: "Test completed"};
  } catch(error) {
    console.error(`Tests error: ${error}`);
    return {success: false, error: String(error)};
  }
}
