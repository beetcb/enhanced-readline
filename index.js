const replLive = require('./lib/replLive')
const { commonPrefix, completeSimulation } = require('./lib/utils')

const instance = {
  replLive(prompt, len) {
    this.instance = new replLive(prompt, len)
    return this.instance
  },
  onInput(callback) {
    this.instance.on('key', key => callback(key))
  },
  onTab(callback) {
    this.instance.on('complete', input => {
      const [selectedList, target] = callback(input)
      const rl = this.instance.rl
      const len = selectedList.length
      let changedList = [selectedList, target]

      if (!len) {
        this.instance.refresh()
        return
      } else if (len > 1) {
        const prefix = commonPrefix(selectedList)
        const checkPrefix = prefix && prefix.length > target.length
        // If option list has common prefix, write it
        if (checkPrefix) {
          rl.write(prefix)
        }
        changedList = [[]]
        // Construct a string for output
        const refreshContent = selectedList.reduce(
          (s, e) => `${s ? '' : '\n'}${s}${e}\n`,
          ''
        )
        if (refreshContent && !checkPrefix)
          this.instance.refresh(refreshContent)
      }
      completeSimulation(rl, changedList)
    })
  },
  onArrow(callback) {
    this.instance.on('arrow', i => callback(i))
  },
  onAny(callback) {
    this.instance.on('any', data => callback(data))
  },
  refresh(string) {
    this.instance.refresh(string)
  },
}

module.exports = instance
