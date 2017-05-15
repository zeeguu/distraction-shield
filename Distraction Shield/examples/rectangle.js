export default class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  get surface() {
    return this.height * this.width;
  }
}
