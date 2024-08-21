const min=60;
const max=80;
let damage =0;

for(let i=0;i<=100;i++){
    damage = Math.floor(Math.random()*(max - min) + min);
    if(damage === 70){
        console.log(true)
    }
}