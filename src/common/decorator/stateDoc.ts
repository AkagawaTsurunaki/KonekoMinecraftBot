import {DocumentManager} from "../doc/documentManager";
import {StateDocument} from "../doc/stateDocument";

export function stateDoc(doc: { name: string, description: string, issue?: string }) {
    return (target: any) => {
        const stateDoc = new StateDocument(doc.name, doc.description, doc.issue);
        DocumentManager.addStateDoc(stateDoc)
    }
}