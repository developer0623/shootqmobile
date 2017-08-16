export class ColorHelper {

  static getContrastYIQ(hexcolor: string): string {
    if (hexcolor.startsWith('#')) {
      hexcolor = hexcolor.replace('#', '');
    }
    if (hexcolor.length === 3) {
      hexcolor += hexcolor;
    }
    let r = parseInt(hexcolor.substr(0, 2), 16);
    let g = parseInt(hexcolor.substr(2, 2), 16);
    let b = parseInt(hexcolor.substr(4, 2), 16);
    let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }
}
