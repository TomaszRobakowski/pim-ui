import { LoremIpsum } from "./lorem-ipsum";

const loremIpsumArray = LoremIpsum.split(' ');

export function getRandomName(): string {
    const length = getRandomInt(2)+1;
    const loremIpsumLength = loremIpsumArray.length;
    let name = ''
    for (let i = 0; i < length; i++) {
        const partName = loremIpsumArray[getRandomInt(loremIpsumLength)]
        name = `${name} ${capitalise(partName)}`
    }
    return name
}

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export function capitalise(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  }

export function getRandomDate(past: boolean = true) {
    const date = new Date();
    let factor = 1;

    if ( past ) {
        factor = -1
    }

    date.setDate( date.getDate() + factor * getRandomInt(365) );
    return date;
}  

export function getRandomBool(): boolean {
    //return true;
    return Math.floor(Math.random() * 100) < 50;
}