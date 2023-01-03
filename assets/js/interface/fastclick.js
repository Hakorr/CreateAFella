function fastClick(elem, clickCb, holdCb) {
    const holdTimeThresholdMs = 500;

    elem.addEventListener('pointerdown', e => {
        e.preventDefault();

        let timeout = null;
        let abort = false;

        function load() {
            if(holdCb) {
                timeout = setTimeout(() => {
                    holdCb();
                    destroy();
                }, holdTimeThresholdMs);
            }

            document.addEventListener('pointermove', moving);
            document.addEventListener('touchmove', moving);
            elem.addEventListener('pointerup', pointerup);
        }

        function destroy() {
            abort = true;
            clearTimeout(timeout);

            document.removeEventListener('pointermove', moving);
            document.removeEventListener('touchmove', moving);
            elem.removeEventListener('pointerup', pointerup);
        }

        function moving(e_move) {
            e_move.preventDefault();
            let outsideOfTarget;

            if(e_move?.touches) {
                const scuffedPath = document.elementsFromPoint(e_move.touches[0].clientX, e_move.touches[0].clientY);

                outsideOfTarget = !scuffedPath.includes(elem);
            } else {
                const path = e_move.path || (e_move.composedPath && e_move.composedPath());

                outsideOfTarget = !path.includes(elem);
            }

            if(outsideOfTarget) {
                destroy();
            }
        }
    
        function pointerup(e_up) {
            e_up.preventDefault();
    
            if(!abort) {
                clickCb(e_up);

                destroy();
            }
        }
    
        load();
    });
}