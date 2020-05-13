import _ from 'lodash'

export function dedup(param, delay, ctx, action) {
  ctx.latestParam = param
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (_.isEqual(param, ctx.latestParam)) {
        action(param).then(res => resolve(res))
      } else {
        reject(new Error('Action canceled due to param change'))
      }
    }, delay)
  })
}
