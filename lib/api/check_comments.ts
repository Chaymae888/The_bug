// lib/api.js
import {api} from "@/lib/api/endpoints";
interface ToxicityPrediction {
    toxic: boolean;
    severe_toxic: boolean;
    obscene: boolean;
    threat: boolean;
    insult: boolean;
    identity_hate: boolean;
}

export async function checkToxicity(text: string):Promise<ToxicityPrediction> {
    const response = await api.checkComment(text);

    if (!response.ok) {
        throw new Error('Failed to check toxicity');
    }

    return await response.json();
}