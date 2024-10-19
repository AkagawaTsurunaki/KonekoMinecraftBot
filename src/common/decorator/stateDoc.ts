import {StateDocument} from "../../document/stateDocument";
import {DocumentManager} from "../../document/documentManager";

export function stateDoc(doc: { name: string, description: string, issue?: string }) {
    return (target: any) => {
        const stateDoc = new StateDocument(doc.name, doc.description, doc.issue);
        DocumentManager.addStateDoc(stateDoc)
    }
}