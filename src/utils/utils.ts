export function sleep(milis: number): Promise<void>{
    return new Promise(resolve => setTimeout(resolve, milis));
}

export function getNumberSequence(from: number, to: number): Array<number>{
    const result = []
    for(let i = from; i <= to; i++ ){
        result.push(i)
    }

    return result
}


export function noop(k){ return k }


const alphabets = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function randomString(length: number= 5): string {

    const result = new Array<String>(length)
    for(let i = 0; i<result.length; i++){
        result[i] = alphabets.charAt(Math.random() * (alphabets.length - 1))
    }
    return result.join("")
}