def writeLCD(reg: bool, data: int):
    dl = data & 0x0f << 4;
    du = data & 0xf0;
    if reg:
        dl |= 1;
        du |= 1;
    

def setBacklight(on: bool):
    if on:
        pins.i2c_write_number(i2cAdr, 12, NumberFormat.INT8_LE, False)
    else:
        pins.i2c_write_number(i2cAdr, 4, NumberFormat.INT8_LE, False)
i2cAdr = 0
i2cAdr = 39

def on_forever():
    setBacklight(True)
    basic.pause(1000)
    setBacklight(False)
    basic.pause(1000)
basic.forever(on_forever)
