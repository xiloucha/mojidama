import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Language = 'ja' | 'en' | 'zh';

type BallState =
  | 'normal'
  | 'frozen'
  | 'warm'
  | 'thawed'
  | 'rainbow';

interface Action {
  id: string;
  ja: string;
  en: string;
  zh: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {

  @HostListener('input', ['$event'])
onInput(event: Event): void {

  const textarea =
    event.target as HTMLTextAreaElement;

  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  text = '';

  generated = false;
  ballExists = false;

  language: Language = 'ja';

  submenu: 'none' | 'play' | 'other' = 'none';

  // =========================
  // MESSAGE
  // =========================

  message = '';

  private messageJa = '';
  private messageEn = '';
  private messageZh = '';


  // =========================
  // BALL STATE
  // =========================

  state: BallState = 'normal';

  // 文字玉が増えた回数
  multiplicationLevel = 0;

  // 冷凍 → 土に埋める、の途中状態
  planted = false;


  // =========================
  // ACTIONS
  // =========================

  actions: Action[] = [
    {
      id: 'burn',
      ja: '燃やす',
      en: 'Burn it',
      zh: '烧掉'
    },
    {
      id: 'flow',
      ja: '流す',
      en: 'Let it flow',
      zh: '放走'
    },
    {
      id: 'kick',
      ja: '蹴る',
      en: 'Kick it',
      zh: '踢'
    },
    {
      id: 'hit',
      ja: '叩く',
      en: 'Hit it',
      zh: '敲'
    },
    {
      id: 'play',
      ja: '遊ぶ',
      en: 'Play',
      zh: '玩'
    },
    {
      id: 'other',
      ja: 'その他',
      en: 'Other',
      zh: '其他'
    }
  ];


  playActions: Action[] = [
    {
      id: 'catch',
      ja: 'キャッチボールする',
      en: 'Play catch',
      zh: '玩接球'
    },
    {
      id: 'dribble',
      ja: 'ドリブルする',
      en: 'Dribble it',
      zh: '拍着玩'
    },
    {
      id: 'finger',
      ja: '人差し指の上に乗せる',
      en: 'Balance it on your finger',
      zh: '放在食指上'
    },
    {
      id: 'roll',
      ja: 'コロコロ転がす',
      en: 'Roll it around',
      zh: '滚一滚'
    },
    {
      id: 'dog',
      ja: '犬に見せる',
      en: 'Show it to a dog',
      zh: '给狗看'
    }
  ];


  otherActions: Action[] = [
    {
      id: 'refrigerator',
      ja: '冷蔵庫に入れる',
      en: 'Put it in the refrigerator',
      zh: '放进冰箱'
    },
    {
      id: 'freezer',
      ja: '冷凍庫に入れる',
      en: 'Put it in the freezer',
      zh: '放进冷冻室'
    },
    {
      id: 'microwave',
      ja: '電子レンジに入れる',
      en: 'Put it in the microwave',
      zh: '放进微波炉'
    },
    {
      id: 'bury',
      ja: '土に埋める',
      en: 'Bury it in the soil',
      zh: '埋进土里'
    },
    {
      id: 'water',
      ja: '水をやる',
      en: 'Water it',
      zh: '浇水'
    },
    {
      id: 'travel',
      ja: '旅に出る',
      en: 'Go on a journey',
      zh: '踏上旅程'
    }
  ];


  // =========================
  // INIT
  // =========================

  ngAfterViewInit(): void {
    this.clearCanvas();
  }


  // =========================
  // GENERATE
  // =========================

  generate(): void {

    if (!this.text.trim()) {
      return;
    }

    this.state = 'normal';

    this.multiplicationLevel = 0;

    this.planted = false;

    this.generated = true;
    this.ballExists = true;

    this.clearMessage();

    this.submenu = 'none';

    setTimeout(() => {
      this.draw();
    });
  }


  // =========================
  // MAIN ACTION
  // =========================

  chooseAction(action: Action): void {

    if (!this.ballExists) {
      return;
    }


    // -------------------------
    // BURN
    // -------------------------

    if (action.id === 'burn') {

      if (this.multiplicationLevel > 0) {

        this.setMessage(
          'いっぱい燃えました。',
          'A lot of them burned.',
          '很多文字玉烧掉了。'
        );

      } else {

        this.setMessage(
          '燃えました。',
          'It burned.',
          '烧掉了。'
        );
      }

      this.removeBall();
      return;
    }


    // -------------------------
    // FLOW
    // -------------------------

    if (action.id === 'flow') {

      if (this.multiplicationLevel > 0) {

        this.setMessage(
          'いっぱい流れていきました。',
          'A lot of them floated away.',
          '很多文字玉流走了。'
        );

      } else {

        this.setMessage(
          '流れていきました。',
          'It floated away.',
          '流走了。'
        );
      }

      this.removeBall();
      return;
    }


    // -------------------------
    // KICK
    // -------------------------

    if (action.id === 'kick') {

      if (this.multiplicationLevel > 0) {

        this.setMessage(
          'いっぱい蹴ったので足が疲れました。',
          'Kicking so many of them made your feet tired.',
          '踢了很多，脚都累了。'
        );

      } else {

        this.setMessage(
          '飛んでいきました。',
          'It flew away.',
          '飞走了。'
        );
      }

      this.removeBall();
      return;
    }


    // -------------------------
    // HIT
    // -------------------------

    if (action.id === 'hit') {

      if (this.multiplicationLevel > 0) {

        this.setMessage(
          'いっぱい叩いたので手が疲れました。',
          'Hitting so many of them made your hand tired.',
          '敲了很多下，手都累了。'
        );

      } else {

        this.setMessage(
          'バラバラに壊れました。',
          'It broke apart.',
          '散开了。'
        );
      }

      this.removeBall();
      return;
    }


    // -------------------------
    // PLAY
    // -------------------------

    if (action.id === 'play') {
      this.submenu = 'play';
      return;
    }


    // -------------------------
    // OTHER
    // -------------------------

    if (action.id === 'other') {
      this.submenu = 'other';
      return;
    }
  }


  // =========================
  // OTHER ACTION
  // =========================

  chooseOtherAction(action: Action): void {

    if (!this.ballExists) {
      return;
    }


    // -------------------------
    // TRAVEL
    // -------------------------

    if (action.id === 'travel') {

      this.setMessage(
        '旅に出ました。',
        'It went on a journey.',
        '踏上了旅程。'
      );

      this.removeBall();

      return;
    }


    // -------------------------
    // REFRIGERATOR
    // -------------------------

    if (action.id === 'refrigerator') {

      if (this.multiplicationLevel > 0) {

        this.setMessage(
          'いっぱい冷えました。',
          'They all got a little cold.',
          '很多文字玉都冷了一点。'
        );

      } else {

        this.setMessage(
          '少し冷えました。',
          'It got a little cold.',
          '冷了一点。'
        );
      }

      this.submenu = 'none';

      return;
    }


    // -------------------------
    // FREEZER
    // -------------------------

    if (action.id === 'freezer') {

      this.state = 'frozen';

      this.planted = false;

      if (this.multiplicationLevel > 0) {

        this.setMessage(
          'いっぱい冷えました。',
          'They all froze.',
          '很多文字玉都冻住了。'
        );

      } else {

        this.setMessage(
          '冷えました。',
          'It froze.',
          '冻住了。'
        );
      }

      this.submenu = 'none';

      this.draw();

      return;
    }


    // -------------------------
    // MICROWAVE
    // -------------------------

    if (action.id === 'microwave') {

      if (this.state === 'frozen') {

        this.state = 'thawed';

        if (this.multiplicationLevel > 0) {

          this.setMessage(
            'いっぱい解凍されました。',
            'They were all thawed.',
            '很多文字玉都解冻了。'
          );

        } else {

          this.setMessage(
            '解凍されました。',
            'It was thawed.',
            '解冻了。'
          );
        }

      } else {

        this.state = 'warm';

        if (this.multiplicationLevel > 0) {

          this.setMessage(
            'いっぱい温まりました。',
            'They all got warm.',
            '很多文字玉都变暖了。'
          );

        } else {

          this.setMessage(
            '温まりました。',
            'It got warm.',
            '变暖了。'
          );
        }
      }

      this.submenu = 'none';

      this.draw();

      return;
    }


    // -------------------------
    // BURY
    // -------------------------

    if (action.id === 'bury') {

      if (this.state === 'frozen') {

        this.planted = true;

        if (this.multiplicationLevel > 0) {

          this.setMessage(
            'いっぱい土に埋まりました。',
            'They were all buried in the soil.',
            '很多文字玉都埋进土里了。'
          );

        } else {

          this.setMessage(
            '土に埋まりました。',
            'It was buried in the soil.',
            '埋进土里了。'
          );
        }

      } else {

        // 通常状態で土に埋めると増える

        if (this.multiplicationLevel < 4) {

          this.multiplicationLevel++;

          if (this.multiplicationLevel === 1) {

            this.setMessage(
              '増えました。',
              'They multiplied.',
              '变多了。'
            );

          } else if (this.multiplicationLevel === 2) {

            this.setMessage(
              'また増えました。',
              'They multiplied again.',
              '又变多了。'
            );

          } else if (this.multiplicationLevel === 3) {

            this.setMessage(
              'さらに増えました。',
              'They multiplied again.',
              '又增加了。'
            );

          } else {

            this.setMessage(
              'かなり増えました。',
              'They multiplied quite a lot.',
              '变得更多了。'
            );
          }

        } else {

          this.setMessage(
            'これ以上増えません。',
            'They cannot multiply any further.',
            '不能再增加了。'
          );
        }
      }

      this.submenu = 'none';

      return;
    }


    // -------------------------
    // WATER
    // -------------------------

    if (action.id === 'water') {

      // 冷凍 → 土 → 水 → 虹色

      if (
        this.state === 'frozen' &&
        this.planted
      ) {

        this.becomeRainbow();

        return;
      }


      if (this.multiplicationLevel > 0) {

        this.setMessage(
          'いっぱい水をやりました。',
          'They were all watered.',
          '给很多文字玉都浇了水。'
        );

      } else {

        this.setMessage(
          '水をやりました。',
          'It was watered.',
          '浇水了。'
        );
      }

      this.submenu = 'none';

      return;
    }


    this.submenu = 'none';
  }


  // =========================
  // PLAY ACTION
  // =========================

  choosePlayAction(action: Action): void {

    if (!this.ballExists) {
      return;
    }


    if (action.id === 'catch') {

      if (this.multiplicationLevel > 0) {

        this.setMessage(
          'いっぱい投げました。',
          'You threw them a lot.',
          '投了很多次。'
        );

      } else {

        this.setMessage(
          '投げました。',
          'It was thrown.',
          '投了出去。'
        );
      }
    }


    if (action.id === 'dribble') {

      if (this.multiplicationLevel > 0) {

        this.setMessage(
          'いっぱい弾みました。',
          'They bounced a lot.',
          '很多文字玉弹了起来。'
        );

      } else {

        this.setMessage(
          '弾みました。',
          'It bounced.',
          '弹起来了。'
        );
      }
    }


    if (action.id === 'finger') {

      if (this.multiplicationLevel > 0) {

        this.setMessage(
          '乗せきれませんでした。',
          'They could not all fit on one finger.',
          '没办法全部放在一根手指上。'
        );

      } else {

        this.setMessage(
          '乗りました。',
          'It balanced on your finger.',
          '放上去了。'
        );
      }
    }


    if (action.id === 'roll') {

      if (this.multiplicationLevel > 0) {

        this.setMessage(
          'いっぱい転がりました。',
          'They rolled around a lot.',
          '很多文字玉滚来滚去。'
        );

      } else {

        this.setMessage(
          '転がりました。',
          'It rolled around.',
          '滚起来了。'
        );
      }
    }


    if (action.id === 'dog') {

      if (this.multiplicationLevel > 0) {

        this.setMessage(
          '犬はいっぱい見ました。',
          'The dog saw a lot of them.',
          '狗看到了很多。'
        );

      } else {

        this.setMessage(
          '犬は見ました。',
          'The dog saw it.',
          '狗看到了。'
        );
      }
    }

    this.submenu = 'none';
  }


  // =========================
  // RAINBOW
  // =========================

  becomeRainbow(): void {

    this.state = 'rainbow';

    if (this.multiplicationLevel > 0) {

      this.setMessage(
        'いっぱい虹色文字玉ができました。',
        'A lot of rainbow letter balls appeared.',
        '出现了很多彩虹文字玉。'
      );

    } else {

      this.setMessage(
        '虹色文字玉になりました。',
        'It became a rainbow letter ball.',
        '变成了彩虹文字玉。'
      );
    }

    this.submenu = 'none';

    this.draw();
  }


  // =========================
  // MESSAGE
  // =========================

  private setMessage(
    ja: string,
    en: string,
    zh: string
  ): void {

    this.messageJa = ja;
    this.messageEn = en;
    this.messageZh = zh;

    this.updateMessage();
  }


  private updateMessage(): void {

    if (this.language === 'en') {
      this.message = this.messageEn;
      return;
    }

    if (this.language === 'zh') {
      this.message = this.messageZh;
      return;
    }

    this.message = this.messageJa;
  }


  private clearMessage(): void {

    this.message = '';

    this.messageJa = '';
    this.messageEn = '';
    this.messageZh = '';
  }


  // =========================
  // LANGUAGE
  // =========================

  setLanguage(language: Language): void {

    this.language = language;

    // 現在表示されている結果も即座に翻訳し直す
    this.updateMessage();
  }


  getLabel(action: Action): string {

    if (this.language === 'en') {
      return action.en;
    }

    if (this.language === 'zh') {
      return action.zh;
    }

    return action.ja;
  }


  // =========================
  // REMOVE BALL
  // =========================

  removeBall(): void {

    this.ballExists = false;

    this.generated = false;

    this.submenu = 'none';

    this.text = '';

    this.clearCanvas();
  }


  // =========================
  // CLOSE SUBMENU
  // =========================

  closeSubmenu(): void {
    this.submenu = 'none';
  }


  // =========================
  // DRAW
  // =========================

  draw(): void {

    if (!this.canvas) {
      return;
    }

    const canvas =
      this.canvas.nativeElement;

    const ctx =
      canvas.getContext('2d');

    if (!ctx) {
      return;
    }


    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    if (!this.ballExists || !this.text) {
      return;
    }


    const characters =
      Array.from(this.text);


    const centerX = 150;
    const centerY = 150;


    const radius =
      Math.min(
        95,
        25 + Math.sqrt(characters.length) * 1.8
      );


    const fontSize =
      Math.max(
        10,
        Math.min(
          32,
          30 - Math.sqrt(characters.length) * 0.25
        )
      );


    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';


    characters.forEach(
      (char, index) => {

        const angle =
          Math.random() * Math.PI * 2;

        const distance =
          radius *
          Math.random() *
          Math.random();


        const x =
          centerX +
          Math.cos(angle) * distance;

        const y =
          centerY +
          Math.sin(angle) * distance;


        const rotation =
          (Math.random() - 0.5) *
          Math.PI;


        ctx.save();

        ctx.translate(x, y);

        ctx.rotate(rotation);

        ctx.font =
          `${fontSize}px sans-serif`;


        if (this.state === 'rainbow') {

          const hue =
            (index / characters.length) * 360;

          ctx.fillStyle =
            `hsl(${hue}, 80%, 55%)`;

        } else {

          ctx.fillStyle =
            '#222';
        }


        ctx.fillText(
          char,
          0,
          0
        );

        ctx.restore();
      }
    );
  }


  // =========================
  // CLEAR CANVAS
  // =========================

  clearCanvas(): void {

    if (!this.canvas) {
      return;
    }

    const canvas =
      this.canvas.nativeElement;

    const ctx =
      canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  }
}