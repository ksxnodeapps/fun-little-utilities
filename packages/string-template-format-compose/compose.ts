import { composeXs } from '@tsfun/function'
import Tag from 'string-template-format-base'

export interface Compose {
  /**
   * Compose a tag with a function
   * @param g Outer unary function
   * @param f Inner template literal tag
   * @returns Template literal tag
   */
  <Fx, Gy, FyGx>(
    g: (x: FyGx) => Gy,
    f: Tag<Fx, FyGx>,
  ): Tag<Fx, Gy>
}

export const compose: Compose = composeXs
export default compose
