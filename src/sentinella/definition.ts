import { Selector } from "./selector"
import { Scope, EventListenerSet } from "./scope"
import { TraitConstructor, traitConstructorForPrototype } from "./trait"

export function scopesForDefinition(definition): Scope[] {
  const scopes: Scope[] = []
  for (const key in definition) {
    const selector = Selector.get(key)
    const definitionBody = definition[key]
    const scope = scopeForSelectorAndDefinitionBody(selector, definitionBody)
    scopes.push(scope)
  }

  return scopes
}

function scopeForSelectorAndDefinitionBody(selector: Selector, definitionBody): Scope {
  const eventListeners = eventListenersForDefinitionBody(definitionBody)
  const controllerConstructor = controllerConstructorForDefinitionBody(definitionBody)
  const childScopes = childScopesForDefinitionBody(definitionBody)

  return new Scope({
    selector: selector,
    traitConstructor: controllerConstructor,
    eventListeners: eventListeners,
    childScopes: childScopes
  })
}

function eventListenersForDefinitionBody(definitionBody): EventListenerSet {
  const eventListeners = {}
  for (const key in definitionBody) {
    if (propertyIsEventListener(definitionBody, key)) {
      const name = key.slice(2)
      eventListeners[name] = definitionBody[key]
    }
  }

  return eventListeners
}

function controllerConstructorForDefinitionBody(definitionBody): TraitConstructor {
  const prototype = {}
  for (const key in definitionBody) {
    if (propertyIsControllerProperty(definitionBody, key)) {
      const descriptor = Object.getOwnPropertyDescriptor(definitionBody, key)
      Object.defineProperty(prototype, key, descriptor)
    }
  }

  return traitConstructorForPrototype(prototype)
}

function childScopesForDefinitionBody(definitionBody): Scope[] {
  const definition = {}
  for (const key in definitionBody) {
    if (propertyIsDefinition(definitionBody, key)) {
      definition[key] = definitionBody[key]
    }
  }

  return scopesForDefinition(definition)
}

function propertyIsEventListener(definitionBody, key): boolean {
  const {value} = Object.getOwnPropertyDescriptor(definitionBody, key)
  return key.startsWith("on") && typeof value == "function"
}

function propertyIsControllerProperty(definitionBody, key): boolean {
  return !propertyIsEventListener(definitionBody, key) &&
    !propertyIsDefinition(definitionBody, key)
}

function propertyIsDefinition(definitionBody, key): boolean {
  const {value} = Object.getOwnPropertyDescriptor(definitionBody, key)
  return valueIsPlainObject(value)
}

function valueIsPlainObject(value): boolean {
  return value != null && typeof value == "object" &&
    prototypeIsNullOrExtendedObject(value)
}

function prototypeIsNullOrExtendedObject(value): boolean {
  const prototype = Object.getPrototypeOf(value)
  return prototype == null || prototype.constructor == Object
}
