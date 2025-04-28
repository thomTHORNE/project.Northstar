import { ref } from "vue";

export enum TransitionName {
    TransitionCancel = "transitioncancel",
    TransitionEnd = "transitionend",
    TransitionRun = "transitionrun",
    TransitionStart = "transitionstart"
}

export function useWaitForTransition( transitionName: TransitionName, element: HTMLElement, propertyMatch: string[], fn?: () => void ) {
    const transitionEnded = ref( false );

    function listener( event: TransitionEvent ) {
        if (propertyMatch.includes( event.propertyName )) {
            fn?.();
            transitionEnded.value = true;
            element.removeEventListener( transitionName, listener )
        }
    }

    element.addEventListener( transitionName, listener )
    return transitionEnded
}