export abstract class Root {}
export abstract class DataPropertyWrapper extends Root {}
export abstract class AccessorWrapper extends Root {}
export abstract class PartialAccessorWrapper extends AccessorWrapper {}
export abstract class CompleteAccessorWrapper extends AccessorWrapper {}
export abstract class GetterOnlyWrapper extends PartialAccessorWrapper {}
export abstract class SetterOnlyWrapper extends PartialAccessorWrapper {}
