import { Fancybox } from "@fancyapps/ui/dist/fancybox.esm";
import "@fancyapps/ui/dist/fancybox.css";
import { useCallback } from "react";

export const useFancybox = (closingCallback = null) => {

  const openFancybox = useCallback(href => {
    console.log("useFancybox open", href)
    
    Fancybox.show([{
      src: href,
      type: 'iframe',
      preload: false,
    }], {
      animated: false,
      infinite: false,
      hideScrollbar: false,

      on: {
        //"*": (event, fancybox, slide) => {
        //  console.log(`event: ${event} fancybox`, fancybox);
        //  console.log(`event: ${event} slide`, slide);
        //},
        closing: (fancybox, slide) => {
          console.log("fancybox closing ", fancybox);
          console.log("fancybox closing returnValue", fancybox.returnValue);
          closingCallback && closingCallback(fancybox.returnValue);
        },
        done: (fancybox, slide) => {
          console.log(`fancybox done!`, slide);
          $.fancybox = fancybox;
        },
      },
    });
  }, [closingCallback])

  

  const destroy = useCallback(() => {
    Fancybox.destroy();
  }, [])
  

  return { openFancybox, destroy, Fancybox }
};

export const closeFancybox = (returnValue = {} as any) => {
  if (parent.$.fancybox) {
    const $fancybox = parent.$.fancybox as any;
    $fancybox.returnValue = returnValue;
    $fancybox.close();
  }

}