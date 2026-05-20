import { Input, Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.image('croc_walk_1', '/assets/character/walk1.png');
        this.load.image('croc_walk_2', '/assets/character/walk2.png');
        this.load.image('croc_walk_3', '/assets/character/walk3.png');
        this.load.image('croc_walk_4', '/assets/character/walk4.png');
        this.load.image('croc_walk_5', '/assets/character/walk5.png');

        this.load.image('bg_1', '/assets/background/bg1.png');
        this.load.image('bg_2', '/assets/background/bg2.png');
        this.load.image('bg_3', '/assets/background/bg3.png');
    }

    create ()
    {
        const levelWidth = 3400;
        const levelHeight = 900;
        const levelPaddingLeft = 200;

        this.targetWord = 'KROKOWOORD';
        this.totalLetters = this.targetWord.length;
        this.nextLetterIndex = 0;
        this.lastHintAt = 0;

        this.physics.world.setBounds(-levelPaddingLeft, 0, levelWidth + levelPaddingLeft, levelHeight);
        this.cameras.main.setBounds(-levelPaddingLeft, 0, levelWidth + levelPaddingLeft, levelHeight);

        this.createAnimatedBackground();

        this.platforms = this.physics.add.staticGroup();

        this.createPlatform(levelWidth / 2, 860, levelWidth, 80, 0x6ab04c);
        this.createPlatform(500, 690, 280, 28, 0x78c46a);
        this.createPlatform(850, 560, 260, 28, 0x78c46a);
        this.createPlatform(1220, 480, 280, 28, 0x78c46a);
        this.createPlatform(1580, 620, 300, 28, 0x78c46a);
        this.createPlatform(1920, 520, 220, 28, 0x78c46a);
        this.createPlatform(2300, 660, 280, 28, 0x78c46a);
        this.createPlatform(2620, 560, 280, 28, 0x78c46a);
        this.createPlatform(2940, 470, 260, 28, 0x78c46a);
        this.createPlatform(3220, 600, 220, 28, 0x78c46a);

        if (!this.anims.exists('walk'))
        {
            this.anims.create({
                key: 'walk',
                frames: [
                    { key: 'croc_walk_1' },
                    { key: 'croc_walk_2' },
                    { key: 'croc_walk_3' },
                    { key: 'croc_walk_4' },
                    { key: 'croc_walk_5' }
                ],
                frameRate: 8,
                repeat: -1
            });
        }

        this.player = this.add.sprite(120, 500, 'croc_walk_1');
        this.player.setScale(0.15);
        this.player.setDepth(20);
        this.player.setOrigin(0.5, 1);

        this.playerBody = this.add.rectangle(120, 500, 132, 36, 0xff0000, 0);
        this.physics.add.existing(this.playerBody);
        this.playerBody.body.setCollideWorldBounds(true);
        this.playerBody.body.setBounce(0.05);
        this.playerBody.body.setDragX(1400);
        this.playerBody.body.setMaxVelocity(260, 900);

        this.physics.add.collider(this.playerBody, this.platforms);

        this.cameras.main.startFollow(this.playerBody, true, 0.09, 0.09);
        this.cameras.main.setLerp(0.08, 0.08);

        this.collectedLabel = this.add.text(20, 20, 'Letters: 0/' + this.totalLetters, {
            fontFamily: 'Verdana',
            fontSize: '28px',
            color: '#153243',
            stroke: '#ffffff',
            strokeThickness: 4
        }).setScrollFactor(0).setDepth(200);

        this.wordLabel = this.add.text(20, 58, 'Word: ' + '_'.repeat(this.totalLetters), {
            fontFamily: 'Verdana',
            fontSize: '28px',
            color: '#1d3557',
            stroke: '#ffffff',
            strokeThickness: 4
        }).setScrollFactor(0).setDepth(200);

        this.nextLabel = this.add.text(20, 96, 'Next: K', {
            fontFamily: 'Verdana',
            fontSize: '24px',
            color: '#22577a',
            stroke: '#ffffff',
            strokeThickness: 4
        }).setScrollFactor(0).setDepth(200);

        this.hintLabel = this.add.text(20, 132, '', {
            fontFamily: 'Verdana',
            fontSize: '24px',
            color: '#8b1e3f',
            stroke: '#ffffff',
            strokeThickness: 4
        }).setScrollFactor(0).setDepth(200);

        this.winLabel = this.add.text(512, 100, 'Great! You built KROKOWOORD', {
            fontFamily: 'Verdana',
            fontSize: '42px',
            color: '#1b5e20',
            stroke: '#ffffff',
            strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0).setDepth(200).setVisible(false);

        this.restartLabel = this.add.text(512, 150, 'Press R to play again', {
            fontFamily: 'Verdana',
            fontSize: '30px',
            color: '#1b5e20',
            stroke: '#ffffff',
            strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0).setDepth(200).setVisible(false);

        this.letterItems = [];

        const letterPositions = [
            { x: 500, y: 620 },
            { x: 850, y: 490 },
            { x: 1220, y: 410 },
            { x: 1580, y: 550 },
            { x: 1920, y: 450 },
            { x: 2300, y: 590 },
            { x: 2620, y: 490 },
            { x: 2940, y: 400 },
            { x: 3220, y: 530 },
            { x: 3330, y: 350 }
        ];

        this.targetWord.split('').forEach((character, index) => {
            const letter = this.add.text(letterPositions[index].x, letterPositions[index].y, character, {
                fontFamily: 'Verdana',
                fontSize: '72px',
                color: '#fff25f',
                stroke: '#2a2a2a',
                strokeThickness: 8
            }).setOrigin(0.5);

            this.physics.add.existing(letter);
            letter.body.setAllowGravity(false);
            letter.body.setImmovable(true);
            letter.setData('letterIndex', index);

            this.letterItems.push(letter);
            this.physics.add.overlap(this.playerBody, letter, this.collectLetter, null, this);
        });

        this.restartKey = this.input.keyboard.addKey('R');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.rightButtonDown = false;
        this.wasd = this.input.keyboard.addKeys({
            up: Input.Keyboard.KeyCodes.W,
            left: Input.Keyboard.KeyCodes.A,
            right: Input.Keyboard.KeyCodes.D
        });
        this.input.keyboard.addCapture([
            Input.Keyboard.KeyCodes.UP,
            Input.Keyboard.KeyCodes.LEFT,
            Input.Keyboard.KeyCodes.RIGHT,
            Input.Keyboard.KeyCodes.W,
            Input.Keyboard.KeyCodes.A,
            Input.Keyboard.KeyCodes.D,
            Input.Keyboard.KeyCodes.SPACE
        ]);

        this.createRightMoveButton();
    }

    update ()
    {
        const speed = 260;
        const jumpPower = 520;
        const playerBody = this.playerBody.body;
        const onGround = playerBody.blocked.down || playerBody.touching.down || playerBody.onFloor();

        playerBody.setVelocityX(0);

        const moveLeft = this.cursors.left.isDown || this.wasd.left.isDown;
        const moveRight = this.cursors.right.isDown || this.wasd.right.isDown || this.rightButtonDown;
        const jumpPressed = Input.Keyboard.JustDown(this.cursors.up) || Input.Keyboard.JustDown(this.wasd.up);

        if (moveLeft)
        {
            playerBody.setVelocityX(-speed);
            this.player.setFlipX(true);
        }
        else if (moveRight)
        {
            playerBody.setVelocityX(speed);
            this.player.setFlipX(false);
        }

        if (jumpPressed && onGround)
        {
            playerBody.setVelocityY(-jumpPower);
        }

        if (onGround && playerBody.velocity.x !== 0)
        {
            this.player.play('walk', true);
        }
        else
        {
            this.player.anims.stop();
            this.player.setTexture('croc_walk_1');
        }

        this.player.setPosition(this.playerBody.x + 10, this.playerBody.y + 24);

        if (this.winLabel.visible && Input.Keyboard.JustDown(this.restartKey))
        {
            this.scene.restart();
        }
    }

    createPlatform (x, y, width, height, color)
    {
        const platform = this.add.rectangle(x, y, width, height, color).setOrigin(0.5);
        this.physics.add.existing(platform, true);
        this.platforms.add(platform);
    }

    collectLetter (_player, letter)
    {
        if (!letter.active)
        {
            return;
        }

        const index = letter.getData('letterIndex');

        if (index !== this.nextLetterIndex)
        {
            const now = this.time.now;

            if (now - this.lastHintAt > 500)
            {
                this.hintLabel.setText('Wrong order. Next letter is: ' + this.targetWord[this.nextLetterIndex]);
                this.lastHintAt = now;
            }

            return;
        }

        letter.body.enable = false;
        letter.setVisible(false);
        letter.setActive(false);
        this.nextLetterIndex += 1;

        const progressText = this.targetWord.slice(0, this.nextLetterIndex)
            + '_'.repeat(this.targetWord.length - this.nextLetterIndex);

        this.collectedLabel.setText('Letters: ' + this.nextLetterIndex + '/' + this.totalLetters);
        this.wordLabel.setText('Word: ' + progressText);
        this.hintLabel.setText('');

        if (this.nextLetterIndex >= this.targetWord.length)
        {
            this.nextLabel.setText('Next: done');
            this.winLabel.setVisible(true);
            this.restartLabel.setVisible(true);
            return;
        }

        this.nextLabel.setText('Next: ' + this.targetWord[this.nextLetterIndex]);
    }

    createRightMoveButton ()
    {
        const buttonX = 940;
        const buttonY = 690;

        const buttonBg = this.add.circle(buttonX, buttonY, 58, 0x0a9396, 0.9)
            .setScrollFactor(0)
            .setDepth(210)
            .setInteractive({ useHandCursor: true });

        const buttonLabel = this.add.text(buttonX, buttonY - 2, '→', {
            fontFamily: 'Verdana',
            fontSize: '56px',
            color: '#ffffff'
        })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(211);

        const setPressed = (isPressed) => {
            this.rightButtonDown = isPressed;
            buttonBg.setFillStyle(isPressed ? 0x005f73 : 0x0a9396, 0.9);
            buttonLabel.setScale(isPressed ? 0.92 : 1);
        };

        buttonBg.on('pointerdown', () => setPressed(true));
        buttonBg.on('pointerup', () => setPressed(false));
        buttonBg.on('pointerout', () => setPressed(false));
        this.input.on('pointerup', () => setPressed(false));
    }

    createAnimatedBackground ()
    {
        this.backgroundFrames = ['bg_1', 'bg_2', 'bg_3'];
        this.backgroundFrameIndex = 0;

        this.backgroundLayer = this.add.image(0, 0, this.backgroundFrames[this.backgroundFrameIndex])
            .setDepth(-100)
            .setOrigin(0.5)
            .setScrollFactor(0);

        this.updateBackgroundFit();
        this.scale.on('resize', this.updateBackgroundFit, this);

        this.time.addEvent({
            delay: 220,
            loop: true,
            callback: () => {
                this.backgroundFrameIndex = (this.backgroundFrameIndex + 1) % this.backgroundFrames.length;
                this.backgroundLayer.setTexture(this.backgroundFrames[this.backgroundFrameIndex]);
                this.updateBackgroundFit();
            }
        });
    }

    updateBackgroundFit ()
    {
        const camera = this.cameras.main;
        const texture = this.textures.get(this.backgroundFrames[this.backgroundFrameIndex]);
        const source = texture.getSourceImage();

        if (!source || !source.width || !source.height)
        {
            return;
        }

        const screenWidth = camera.width;
        const screenHeight = camera.height;
        const scale = Math.max(screenWidth / source.width, screenHeight / source.height);

        this.backgroundLayer.setPosition(screenWidth * 0.5, screenHeight * 0.5);
        this.backgroundLayer.setDisplaySize(source.width * scale, source.height * scale);
    }
}
