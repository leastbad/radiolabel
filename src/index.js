import { Controller } from 'stimulus'

export default class extends Controller {
  static values = {
    padding: Number,
    targetHeight: Number,
    display: String
  }

  initialize () {
    this.element['imageGrid'] = this
    Array.prototype.filter
      .call(
        this.element.childNodes,
        node => node.nodeType == 3 && !/\S/.test(node.nodeValue)
      )
      .forEach(node => node.remove())
    if (!this.hasPaddingValue) this.paddingValue = 10
    if (!this.hasTargetHeightValue) this.targetHeightValue = 150
    if (!this.hasDisplayValue) this.displayValue = 'inline-block'
    this.resizeObserver = new ResizeObserver(this.observed.bind(this))
  }

  observed (elements) {
    this.albumWidth = elements[0].contentRect.width
    this.processImages()
  }

  connect () {
    this.resizeObserver.observe(this.element)
  }

  disconnect () {
    this.resizeObserver.unobserve(this.element)
  }

  processImages () {
    let row = 0
    this.elements = []
    this.images = Array.from(this.element.children)
    this.images.forEach((ele, index) => {
      const image = ele.nodeName === 'IMG' ? ele : ele.querySelector('img')
      let width, height
      if ('width' in image.dataset && 'height' in image.dataset) {
        width = image.dataset.width
        height = image.dataset.height
      } else {
        const comp = window.getComputedStyle(image)
        width = parseFloat(comp.getPropertyValue('width').slice(0, -2))
        height = parseFloat(comp.getPropertyValue('height').slice(0, -2))
        image.dataset.width = width
        image.dataset.height = height
      }
      const idealW = Math.ceil((width / height) * this.targetHeightValue)
      const idealH = Math.ceil(this.targetHeightValue)
      this.elements.push([ele, idealW, idealH])
      row += idealW + this.paddingValue
      if (row > this.albumWidth && this.elements.length) {
        this.resizeRow(row - this.paddingValue)
        row = 0
        this.elements = []
      }
      if (this.images.length - 1 == index && this.elements.length) {
        this.resizeRow(row)
        row = 0
        this.elements = []
      }
    }, this)
  }

  resizeRow (row) {
    const imageExtras = this.paddingValue * (this.elements.length - 1)
    const albumWidthAdjusted = this.albumWidth - imageExtras
    const overPercent = albumWidthAdjusted / (row - imageExtras)
    let trackWidth = imageExtras
    this.elements.forEach((element, index) => {
      const [ele, idealW, idealH] = element
      let fw = Math.floor(idealW * overPercent)
      let fh = Math.floor(idealH * overPercent)
      const isNotLast = index < this.elements.length - 1
      trackWidth += fw
      if (!isNotLast && trackWidth < this.albumWidth)
        fw += this.albumWidth - trackWidth
      fw--
      const image = ele.nodeName === 'IMG' ? ele : ele.querySelector('img')
      image.style.width = fw + 'px'
      image.style.height = fh + 'px'
      ele.style.marginBottom = this.paddingValue + 'px'
      ele.style.marginRight = isNotLast ? this.paddingValue + 'px' : 0
      ele.style.display = this.displayValue
      ele.style.verticalAlign = 'bottom'
    }, this)
  }
}
