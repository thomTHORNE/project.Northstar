import { useDebounceFn } from "@vueuse/core";

export function switchTheme( themeToggle: boolean, enableTransition: boolean ) {
    const linkElementId = 'theme-link';
    const themeMode = ['theme-light', 'theme-dark'];
    const currentThemeId = themeMode[Number( !themeToggle )];
    const newThemeId = themeMode[Number( themeToggle )];

    const linkElement = document.getElementById( linkElementId );
    const cloneLinkElement = linkElement.cloneNode( true );
    const newThemeUrl = linkElement.getAttribute( 'href' ).replace( currentThemeId, newThemeId );

    cloneLinkElement.setAttribute( 'id', linkElementId + '-clone' );
    cloneLinkElement.setAttribute( 'href', newThemeUrl );
    cloneLinkElement.addEventListener( 'load', () => {
        linkElement.remove();
        cloneLinkElement.setAttribute( 'id', linkElementId );
    } );

    enableTransition && toggleGlobalStyleTransition( cloneLinkElement );
    linkElement.parentNode && linkElement.parentNode.insertBefore( cloneLinkElement, linkElement.nextSibling );
}

export function toggleGlobalStyleTransition( listenToElement: Element ) {
    let styleElement: HTMLStyleElement | undefined;
    styleElement = window!.document.createElement( 'style' );
    const styleString = '* {-webkit-transition: background .2s !important; -moz-transition: background .2s !important; -o-transition: background .2s !important; -ms-transition: background .2s !important; transition: background .2s !important}';
    styleElement.appendChild( document.createTextNode( styleString ) );
    window!.document.head.appendChild( styleElement );

    const waitAndRemoveElement = useDebounceFn( () => {
        styleElement.remove();
    }, 200 )

    listenToElement.addEventListener( 'load', () => waitAndRemoveElement() );
}

export function parseHTML( html ) {
    const t = document.createElement( 'template' );
    t.innerHTML = html;
    return t.content.firstElementChild! as HTMLElement;
}