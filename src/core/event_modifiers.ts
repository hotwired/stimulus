export interface EventModifiers extends AddEventListenerOptions {
  stop?: boolean;
  prevent?: boolean;
  self?: boolean;
}
