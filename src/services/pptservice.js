import PptxGenJS from "pptxgenjs";

export function createPPtTest() {
    // 1. Create a Presentation
    let pres = new PptxGenJS;

//  2. Add a Slide to the presentation
    let slide = pres.addSlide();

//     3. Add 1+ object (tables, Shapes, etc.) to the Slide
    slide.addText("Hello world from PptxGenJs...",{
        x:1.5,
        y:1.5,
        color:"363636",
        fill:{color:'#F1F1F1'},
        align: pres.AlignH.center,
    });

//     4. Save the Presentation
    pres.writeFile({fileName:'Smple.pptx'});
}