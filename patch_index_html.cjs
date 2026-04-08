const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'app/views/index.html.twig');
let content = fs.readFileSync(file, 'utf8');

// Find the botched insertion
let searchStr = `            <div class="tab-pane fade h-100" \n            <!-- tab rituels -->`;
if (content.includes(searchStr)) {
    // We need to fix the split tag.
    let startIdx = content.indexOf(`            <div class="tab-pane fade h-100" \n            <!-- tab rituels -->`);
    let endIdx = content.indexOf(`\n\nid="ressources-tab-pane"`);
    
    if (startIdx !== -1 && endIdx !== -1) {
        // Extract the rituels block
        let brokenStart = `            <div class="tab-pane fade h-100" \n`;
        let rituelsBlockLength = endIdx - startIdx - brokenStart.length;
        
        let rituelsBlock = content.substring(startIdx + brokenStart.length, endIdx + 2); // get it all up to \n\n
        
        // Remove the broken part
        let beforeStr = content.substring(0, startIdx);
        let afterStr = content.substring(endIdx + 2); // points to id="ressources...
        
        // Reconstruct properly
        // 1. Put the `ressources-tab-pane` div tag exactly how it was
        // 2. Insert the `rituelsBlock` AFTER the end of the `ressources-tab-pane` div. Or just before it. 
        // Let's insert the `rituelsBlock` right before `<!-- tab ressources -->`
        
        let fixedContent = content.substring(0, startIdx) + 
                           `            <div class="tab-pane fade h-100" ` + 
                           afterStr;
                           
        // Now fixedContent is back to what it was but without the rituels block inside the tag
        // Wait, where do we insert it? Before "<!-- tab groupe -->"!
        fixedContent = fixedContent.replace('            <!-- tab groupe -->', rituelsBlock + '            <!-- tab groupe -->');
        
        fs.writeFileSync(file, fixedContent);
        console.log("Patched successfully.");
    } else {
        console.log("Could not find boundaries.");
    }
} else {
    // Maybe matching is slightly different
    console.log("Could not find search string.");
}
