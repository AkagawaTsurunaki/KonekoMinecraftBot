import {DocumentManager} from "../doc/documentManager";

export function behaviourDoc(info: { name: string, description: string }) {
    return function <T extends new (...args: any[]) => any>(constructor: T) {
        DocumentManager.addBehaviourDoc({name: info.name, description: info.description})
    }
}