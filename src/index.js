import { Controller } from 'stimulus'
import CableReady from 'cable_ready'
import { gsap } from 'gsap'

const dasherize = string => {
  return string.replace(/[A-Z]/g, function (char, index) {
    return (index !== 0 ? '-' : '') + char.toLowerCase()
  })
}

export default class extends Controller {
  initialize () {
    this.operations = Object.keys(CableReady.DOMOperations).map(key =>
      dasherize(key)
    )
  }

  connect () {
    this.operations.forEach(operation =>
      document.addEventListener(
        `cable-ready:after-${operation}`,
        this.intercept
      )
    )
  }

  disconnect () {
    this.operations.forEach(operation =>
      document.removeEventListener(
        `cable-ready:after-${operation}`,
        this.intercept
      )
    )
  }

  intercept = ({ detail, target, type }) => {
    if (target !== document) {
      const style = getComputedStyle(target)
      const border = style.getPropertyValue('border')
      const title = document.createElement('div')
      const overlay = document.createElement('div')

      setTimeout(() => {
        const target_rect = target.getBoundingClientRect()
        const rect =
          target === document.body ? { top: 56, left: 0 } : target_rect

        title.style.cssText = `position:absolute;z-index:5001;top:${rect.top -
          56}px;left:${
          rect.left
        }px;background-color:#fff;padding: 3px 8px 3px 8px;border: 1px solid #000;`

        title.innerHTML = `${
          type.split('after-')[1]
        } <b>${(detail.stimulusReflex && detail.stimulusReflex.target) ||
          ''}</b> \u2192 ${(detail.stimulusReflex &&
          detail.stimulusReflex.selectors[0]) ||
          (target.id && `#${target.id}`) ||
          target.classList.toString()}<br><small>${(detail.stimulusReflex &&
          detail.stimulusReflex.reflexId) ||
          ''}</small>`

        overlay.style.cssText = `position:absolute;z-index:5000;top:${
          target_rect.top
        }px;left:${target_rect.left}px;width:${target_rect.width}px;height:${
          target_rect.height
        }px;background-color: ${
          type === 'cable-ready:after-morph' ? '#FF9800' : '#0F0'
        };`

        overlay.style.border = border

        document.body.appendChild(title)
        document.body.appendChild(overlay)

        gsap.fromTo(
          overlay,
          {
            opacity: 1.0
          },
          {
            opacity: 0,
            duration: 5,
            ease: 'expo',
            onComplete: () => {
              title.remove()
              overlay.remove()
            }
          }
        )
      })
    }
  }
}
