//% weight=5 color=#2699BF icon="\uf110"
namespace LCD {
    let i2cAdr = 0x27;
    let ctrlBits = 0xf8; // Initialize upper bits to one, this ensures we wait for setup of R/W and RS during first use
    let charPos = 1;
    let lineNr = 1;
    let lcdInitialized = false;

    function initLCD() {
        lcdInitialized = true;
        writeLCD(false, 0x33);
        pause(2);
        pins.i2cWriteNumber(i2cAdr, 0x38, NumberFormat.Int8LE);
        pins.i2cWriteNumber(i2cAdr, 0x3c, NumberFormat.Int8LE);
        pins.i2cWriteNumber(i2cAdr, 0x38, NumberFormat.Int8LE);
        pause(2);
        pins.i2cWriteNumber(i2cAdr, 0x28, NumberFormat.Int8LE);
        pins.i2cWriteNumber(i2cAdr, 0x2c, NumberFormat.Int8LE);
        pins.i2cWriteNumber(i2cAdr, 0x28, NumberFormat.Int8LE);
        pause(2);
        writeLCD(false, 0x28);
        displayControl(true, false, false);
        writeLCD(false, 0x06); // cursor moves to right
        generateDKChars();
        clearLCD();
    }

    function writeLCD(dRegister: boolean, data: number) {
        if (!lcdInitialized) initLCD();

        let du = data & 0xf0;
        let dl = data << 4;
        let ctrl = ctrlBits & 0x08;
        if (dRegister) ctrl |= 0x01;

        if (ctrl != ctrlBits) {
            // If R/W or RS has changed we set that change before setting EN high
            pins.i2cWriteNumber(i2cAdr, ctrl | du, NumberFormat.Int8LE);
        }
        pins.i2cWriteNumber(i2cAdr, 0x04 | ctrl | du, NumberFormat.Int8LE); // Set EN high
        pins.i2cWriteNumber(i2cAdr, ctrl | du, NumberFormat.Int8LE); // Latch upper 4 bits
        pins.i2cWriteNumber(i2cAdr, 0x04 | ctrl | dl, NumberFormat.Int8LE); // Set EN high
        pins.i2cWriteNumber(i2cAdr, ctrl | dl, NumberFormat.Int8LE); // Latch lower 4 bits
        ctrlBits = ctrl;
    }

    function generateDKChars() {
        writeLCD(false, 0x40); // Set CGRAM register for char 0 'Æ'
        writeLCD(true, 0x07);
        writeLCD(true, 0x0c);
        writeLCD(true, 0x14);
        writeLCD(true, 0x1f);
        writeLCD(true, 0x14);
        writeLCD(true, 0x14);
        writeLCD(true, 0x17);
        writeLCD(true, 0x00);

        writeLCD(false, 0x48); // Set CGRAM register for char 1 'Ø'
        writeLCD(true, 0x05);
        writeLCD(true, 0x0a);
        writeLCD(true, 0x13);
        writeLCD(true, 0x15);
        writeLCD(true, 0x19);
        writeLCD(true, 0x0a);
        writeLCD(true, 0x14);
        writeLCD(true, 0x00);

        writeLCD(false, 0x50); // Set CGRAM register for char 2 'Å'
        writeLCD(true, 0x04);
        writeLCD(true, 0x00);
        writeLCD(true, 0x04);
        writeLCD(true, 0x0a);
        writeLCD(true, 0x11);
        writeLCD(true, 0x1f);
        writeLCD(true, 0x11);
        writeLCD(true, 0x00);

        writeLCD(false, 0x58); // Set CGRAM register for char 3 'æ'
        writeLCD(true, 0x00);
        writeLCD(true, 0x03);
        writeLCD(true, 0x06);
        writeLCD(true, 0x0a);
        writeLCD(true, 0x1f);
        writeLCD(true, 0x12);
        writeLCD(true, 0x13);
        writeLCD(true, 0x00);

        writeLCD(false, 0x60); // Set CGRAM register for char 4 'ø'
        writeLCD(true, 0x00);
        writeLCD(true, 0x00);
        writeLCD(true, 0x05);
        writeLCD(true, 0x0a);
        writeLCD(true, 0x15);
        writeLCD(true, 0x0a);
        writeLCD(true, 0x14);
        writeLCD(true, 0x00);

        writeLCD(false, 0x68); // Set CGRAM register for char 5 'å'
        writeLCD(true, 0x04);
        writeLCD(true, 0x00);
        writeLCD(true, 0x0e);
        writeLCD(true, 0x01);
        writeLCD(true, 0x0f);
        writeLCD(true, 0x11);
        writeLCD(true, 0x0f);
        writeLCD(true, 0x00);

        writeLCD(false, 0x70); // Set CGRAM register for char 6 modified 'g'
        writeLCD(true, 0x00);
        writeLCD(true, 0x00);
        writeLCD(true, 0x0f);
        writeLCD(true, 0x11);
        writeLCD(true, 0x11);
        writeLCD(true, 0x0f);
        writeLCD(true, 0x01);
        writeLCD(true, 0x0e);

        writeLCD(false, 0x78); // Set CGRAM register for char 7 modified 'y'
        writeLCD(true, 0x00);
        writeLCD(true, 0x00);
        writeLCD(true, 0x11);
        writeLCD(true, 0x11);
        writeLCD(true, 0x11);
        writeLCD(true, 0x0f);
        writeLCD(true, 0x01);
        writeLCD(true, 0x0e);

        writeLCD(false, 0x80);
    }

    /**
     * Tænd eller sluk baggrundslys
     */
    //% blockId=LCD_4x20_backgroundLight
    //% block="Baggrundslys tændt $on"
    export function backgroundLight(on: boolean) {
        if (on) ctrlBits |= 0x08;
        else ctrlBits &= 0xf7;
        pins.i2cWriteNumber(i2cAdr, ctrlBits, NumberFormat.Int8LE);
    }

    /**
     * Slet alt tekst på skærmen
     */
    //% blockId=LCD_4x20_clearLCD
    //% block="Slet skærmen"
    export function clearLCD() {
        writeLCD(false, 0x01);
        pause(2);
    }

    /**
     * Sæt LCD tilstand
     */
    //% blockId=LCD_4x20_displayControl
    //% block="Kontroller skærm tændt $displayOn markør tændt $cursorOn blinkende markør $flashingCursor"
    export function displayControl(displayOn: boolean, cursorOn: boolean, flashingCursor: boolean) {
        let d = 0x08;
        if (displayOn) d |= 0x04;
        if (cursorOn) d |= 0x02;
        if (flashingCursor) d |= 0x01;
        writeLCD(false, d);
    }

    /**
     * Set markør position
     */
    //% blockId=LCD_4x20_setCursorLocation
    //% block="Sæt markør position linje $line kolonne $col"
    //% line.min=1 line.max=4 line.defl=1 col.min=1 col.max=20 col.defl=1
    export function setCursorLocation(line: number, col: number) {
        let e = 0x80 + col;
        if (line == 2) e += 0x40;
        if (line == 3) e += 0x14;
        if (line == 4) e += 0x54;
        writeLCD(false, e);
    }

    /**
     * Skriv tekst
     */
    //% blockId=LCD_4x20_writeText
    //% block="Skriv tekst $str"
    export function writeText(str: string) {
        let written = 0;
        while (written < str.length) {
            if (charPos > 20) {
                charPos = 1;
                lineNr += 1;
                if (lineNr > 4) lineNr = 1;
                setCursorLocation(lineNr, charPos);
            }
            let stop = written + Math.min(20 - charPos, str.length - written);

            for (; written < stop; written++) {
                let c = str.charCodeAt(written);
                switch (c) {
                    case 103:
                        c = 6; // Modified g
                        break;
                    case 121:
                        c = 7; // Modified y
                        break;
                    case 198:
                        c = 0; // Æ
                        break;
                    case 216:
                        c = 1; // Ø
                        break;
                    case 197:
                        c = 2; // Å
                        break;
                    case 230:
                        c = 3; // æ
                        break;
                    case 248:
                        c = 4; // ø
                        break;
                    case 229:
                        c = 5; // å
                        break;
                }
                writeLCD(true, c);
            }
            charPos += written;
        }
    }

    /**
     * Skriv tal
     */
    //% blockId=LCD_4x20_writeNumber
    //% block="Skriv nummer $num"
    export function writeNumber(num: number) {
        writeText(num.toString());
    }
}
