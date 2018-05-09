// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

declare module 'jsdom-simulant' {
    export = Simulant;

    function Simulant(window: Window, type: string, params?: Simulant.EventParams): Event;

    namespace Simulant {

        export interface EventParams {
            [key: string]: any;  // this could be better typed, but CBA right now
        }

        export function fire(documentOrElement: Document | HTMLElement,
                             typeOrEvent: Event | string, params?: Simulant.EventParams): Event;
    }
}
