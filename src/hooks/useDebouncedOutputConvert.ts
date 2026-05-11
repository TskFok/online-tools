import { useRef, useEffect, type DependencyList } from 'react'

/** 输出同步：输入停顿后再跑转换，减轻大文本卡顿；选项变化时用当前全文立即重算 */
export const OUTPUT_CONVERT_DEBOUNCE_MS = 320

/**
 * @param input 主输入文本
 * @param convert 将非空文本转为输出（空时应清空 output/error）
 * @param optionDeps 仅当这些依赖变化时立即对当前 input 调用 convert（如 mode、缩进）
 */
export function useDebouncedOutputConvert(
  input: string,
  convert: (raw: string) => void,
  optionDeps: DependencyList,
): void {
  const inputRef = useRef(input)
  inputRef.current = input

  const convertRef = useRef(convert)
  convertRef.current = convert

  useEffect(() => {
    convertRef.current(inputRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 由 optionDeps 精确控制立即重算时机
  }, optionDeps)

  useEffect(() => {
    if (!input.trim()) {
      convertRef.current('')
      return
    }
    const id = window.setTimeout(() => {
      convertRef.current(inputRef.current)
    }, OUTPUT_CONVERT_DEBOUNCE_MS)
    return () => window.clearTimeout(id)
  }, [input])
}
