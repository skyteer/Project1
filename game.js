import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 300;
    this.minatk = 10;
    this.maxatk = this.minatk + Math.floor(this.minatk * 0.1);
    this.succession = 40;
    this.run = 10;
    this.recovery = 30;
    this.defence = 45;
  }

  up(stage) {
    let rulet = Math.floor(Math.random() * (100 - 1) + 1);
    if (stage >= 1) {
      if (rulet <= 15) {
        this.hp = this.hp + Math.floor(Math.random() * (50 - 20) + 20);
      } else if (rulet <= 30) {
        this.minatk = this.minatk + Math.floor(Math.random() * (20 - 5) + 5);
      } else if (rulet <= 45) {
        this.maxatk = this.maxatk + Math.floor(this.minatk * Math.random() * (1 - 0) + 1);
      } else if (rulet <= 55) {
        this.succession = this.succession + Math.floor(Math.random() * (7 - 3) + 3);
      } else if (rulet <= 65) {
        this.run = this.run + Math.floor(Math.random() * (3 - 1) + 1);
      } else if (rulet <= 80) {
        this.recovery = this.recovery + Math.floor(Math.random() * (10 - 2) + 2);
      } else {
        this.defence = this.defence + Math.floor(Math.random() * (10 - 3) + 3);
      }
    }
  }
  // 밸런스 잡기 어려워서 그냥 아무생각없이 넣어버린 힐 코드 최대치가 없어서
  // 무한대인게 문제
  Recovery() {
    let rulet = Math.floor(Math.random() * (100 - 1) + 1);
    if (rulet <= this.recovery){
      this.hp = this.hp + Math.floor(Math.random() * (100 - 50) + 50)
    }
  }

  attack(target) {
    // 플레이어의 공격
    let damage = Math.floor(Math.random() * (this.maxatk - this.minatk) + this.minatk);
    target.hp -= damage;
  }
  //연속 공격
  Succession(user, target) {
    let rulet = Math.floor(Math.random() * (100 - 1) + 1);
    if (this.succession >= rulet) {
      user.attack(target);
      user.attack(target);
      target.attack(user);
    } else {
      target.attack(user);
    }
  }

  Defence(user, target){
    let rulet = Math.floor(Math.random() * (100 - 1)+1)
    if(this.defence <= rulet){
      user.attack(target);
    }else {
      target.attack(user);
    }
  }

  StageClearReco(user){
    user.hp = user.hp + Math.floor(user.hp * 1.5)
  }
}

class Monster {
  constructor(stage) {
    this.hp = 100 + Math.floor(10 * stage);
    this.minatk = 10 + Math.floor(10 * stage);
    this.maxatk = this.minatk + Math.floor(this.minatk * 0.1) + Math.floor(this.minatk * 0.75);
  }

  attack(target) {
    // 몬스터의 공격
    let damage = Math.floor(Math.random() * (this.maxatk - this.minatk) + this.minatk);
    target.hp -= damage;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| 플레이어 정보`, `| 체력 ${player.hp}`, `| 공격력 ${player.minatk} ~ ${player.maxatk}`, `| 방어력${player.defence}`
    ) +
    chalk.redBright(
      `| 몬스터 정보 |`, `| 체력 ${monster.hp}`, `| 공격력 ${monster.minatk} ~ ${monster.maxatk}`
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 연속공격 (${player.succession}%) 3. 방어 (55%) 4. 도망가기 (${player.run}%) 5. 힐 (${player.recovery}%)`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
    switch (choice) {
      case '1':
        let temp = monster.hp;
        player.attack(monster);
        let damage = temp - monster.hp;
        logs.push(chalk.blueBright(`${damage}만큼 피해를 주었다.`));
        
        let temp1 = player.hp;
        monster.attack(player);
        let damage1 = temp1 - player.hp;
        logs.push(chalk.red(`${damage1}만큼 피해를 받았다.`));
        break;
      case '2':
        let temp2 = monster.hp
        let temp3 = player.hp
        player.Succession(player, monster);
        let damage2 = temp2 - monster.hp;
        logs.push(chalk.blueBright(`${damage2}만큼 피해를 주었다.`));
        let damage3 = temp3 -player.hp
        logs.push(chalk.red(`${damage3}만큼 피해를 받았다.`));
        
        break;
      case '3':
        let temp6 = player.hp
        let temp7 = monster.hp
        player.Defence(player, monster);
        let defence = player.hp
        let damage7 = temp7 - monster.hp
        if(defence === temp6){
          logs.push(chalk.blueBright(`방어에 성공해 피해를 받지않았다.`));
          logs.push(chalk.bgYellowBright(`${damage7}만큼 피해를 주었다.`));
        } else if (defence < temp6) {
          logs.push(chalk.red(`방어애 실패해 ${temp6 - defence}만큼 피해를 받았다.`));
        }
        break;
      case '4':
        let rulet = Math.floor(Math.random() * (100 - 1) +1 )
        if(rulet <= player.run){
          logs.push(chalk.white(`무서워서 도망쳤다!`));
          monster.hp = 0;
        } else {
          let temp = player.hp;
          monster.attack(player);
          let damage = temp - player.hp;
          logs.push(chalk.red(`${damage}만큼 피해를 받았다.`));
        }
      break;
      case '5' :
        let temp4 = player.hp; 
        player.Recovery()
        if(player.hp > temp4){
          let reco = player.hp - temp4
          logs.push(chalk.blue(`${reco}만큼 회복했다.`));
        }
      default:
        console.log("유효한 값을 입력해주세요.");
    }
    if (monster.hp <= 0 || player.hp <= 0) {
      break;
    }
  }

};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;
  let log = [];

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건

    if (monster.hp <= 0 && stage === 10) {
      console.clear();
      console.log("Game clear");
    } else if (monster.hp <= 0) {
      log.push(chalk.blue("Next Stage"));
      await battle(stage, player, monster);
    } else if (player.hp <= 0) {
      console.log("Game Over");
    }

    player.up(stage);
    
    player.StageClearReco(player);

    stage++;
  }
}