

run:
	palm-run ./

package:
	palm-package ./

local:
	chromium-browser --allow-file-access-from-files --enable-file-cookies index.html &
