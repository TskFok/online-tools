export interface RandomResult {
  success: boolean
  output: string
  error?: string
}

export type RandomType = 'integer' | 'float'

/**
 * 生成随机数
 * @param min 最小值（包含）
 * @param max 最大值（包含，整数模式）
 * @param count 生成数量
 * @param type 整数或浮点数
 */
export function generateRandomNumbers(
  min: number,
  max: number,
  count: number,
  type: RandomType = 'integer'
): RandomResult {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { success: false, output: '', error: '最小值和最大值必须是有效数字' }
  }

  if (!Number.isFinite(count) || count < 1) {
    return { success: false, output: '', error: '生成数量必须是大于 0 的整数' }
  }

  if (count > 10000) {
    return { success: false, output: '', error: '单次最多生成 10000 个随机数' }
  }

  if (min > max) {
    return { success: false, output: '', error: '最小值不能大于最大值' }
  }

  const numbers: number[] = []
  for (let i = 0; i < count; i++) {
    if (type === 'integer') {
      const intMin = Math.ceil(min)
      const intMax = Math.floor(max)
      if (intMin > intMax) {
        return { success: false, output: '', error: '整数模式下，有效范围为空（min 向上取整后大于 max 向下取整）' }
      }
      numbers.push(Math.floor(Math.random() * (intMax - intMin + 1)) + intMin)
    } else {
      numbers.push(min + Math.random() * (max - min))
    }
  }

  const output = numbers.join('\n')
  return { success: true, output }
}
