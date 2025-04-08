(function oneko() {
    const nekoEl = document.createElement("div");
    let nekoPosX = 32;
    let nekoPosY = 32;
    let mousePosX = 0;
    let mousePosY = 0;
    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation = null;
    let idleAnimationFrame = 0;
    const nekoSpeed = 10;
    const spriteSets = {
        idle: [[-3, -3]],
        alert: [[-7, -3]],
        scratch: [
            [-5, 0],
            [-6, 0],
            [-7, 0],
        ],
        tired: [[-3, -2]],
        sleeping: [
            [-2, 0],
            [-2, -1],
        ],
        N: [
            [-1, -2],
            [-1, -3],
        ],
        NE: [
            [0, -2],
            [0, -3],
        ],
        E: [
            [-3, 0],
            [-3, -1],
        ],
        SE: [
            [-5, -1],
            [-5, -2],
        ],
        S: [
            [-6, -3],
            [-7, -2],
        ],
        SW: [
            [-5, -3],
            [-6, -1],
        ],
        W: [
            [-4, -2],
            [-4, -3],
        ],
        NW: [
            [-1, 0],
            [-1, -1],
        ],
    };
    function create() {
        nekoEl.id = "oneko";
        nekoEl.style.width = "32px";
        nekoEl.style.height = "32px";
        nekoEl.style.position = "fixed";
        nekoEl.style.backgroundImage = "url('/cursor/oneko.gif')";
        nekoEl.style.imageRendering = "pixelated";
        nekoEl.style.left = "16px";
        nekoEl.style.top = "16px";
        nekoEl.style.zIndex = "10000";

        // Debug: Check if the GIF loads
        const baseUrl = window.location.origin;
        const absolutePath = "/cursor/oneko.gif";
        const fullUrl = baseUrl + absolutePath;
        console.log("Attempting to load oneko.gif from:", fullUrl);

        const img = new Image();
        img.src = absolutePath;
        img.onload = () => console.log("oneko.gif loaded successfully from", fullUrl);
        img.onerror = () => {
            console.error("Failed to load oneko.gif from", fullUrl);
            const relativePath = "./oneko.gif";
            const fullRelativeUrl = baseUrl + "/cursor" + relativePath;
            console.log("Falling back to relative path:", fullRelativeUrl);
            nekoEl.style.backgroundImage = `url('${relativePath}')`;
            const imgFallback = new Image();
            imgFallback.src = relativePath;
            imgFallback.onload = () => console.log("oneko.gif loaded successfully from", fullRelativeUrl);
            imgFallback.onerror = () => {
                console.error("Failed to load oneko.gif from", fullRelativeUrl);
                const rootPath = "/oneko.gif";
                const fullRootUrl = baseUrl + rootPath;
                console.log("Final fallback to root path:", fullRootUrl);
                nekoEl.style.backgroundImage = `url('${rootPath}')`;
                const imgRootFallback = new Image();
                imgRootFallback.src = rootPath;
                imgRootFallback.onload = () => console.log("oneko.gif loaded successfully from", fullRootUrl);
                imgRootFallback.onerror = () => console.error("Failed to load oneko.gif from", fullRootUrl);
            };
        };

        // Temporary: Force background position to top-left to test visibility
        nekoEl.style.backgroundPosition = "0px 0px";
        console.log("Forcing background-position to 0px 0px to test visibility");

        document.body.appendChild(nekoEl);

        // Fix mouse position tracking
        const updateMousePos = (event) => {
            mousePosX = event.clientX;
            mousePosY = event.clientY;
            console.log("Mouse position updated:", { mousePosX, mousePosY });
        };

        // Set initial mouse position (center of the window as a fallback)
        mousePosX = window.innerWidth / 2;
        mousePosY = window.innerHeight / 2;
        console.log("Initial mouse position set to center:", { mousePosX, mousePosY });

        // Use addEventListener instead of onmousemove for better reliability
        document.addEventListener("mousemove", updateMousePos);

        window.onekoInterval = setInterval(frame, 100);
    }

    function setSprite(name, frame) {
        const sprite = spriteSets[name][frame % spriteSets[name].length];
        const posX = sprite[0] * 32;
        const posY = sprite[1] * 32;
        nekoEl.style.backgroundPosition = `${posX}px ${posY}px`;
        console.log(`Setting sprite: ${name}, frame: ${frame}, position: ${posX}px ${posY}px`);
    }

    function resetIdleAnimation() {
        idleAnimation = null;
        idleAnimationFrame = 0;
    }

    function idle() {
        idleTime += 1;

        if (
            idleTime > 10 &&
            Math.floor(Math.random() * 200) == 0 &&
            idleAnimation == null
        ) {
            idleAnimation = ["sleeping", "scratch"][
                Math.floor(Math.random() * 2)
            ];
        }

        switch (idleAnimation) {
            case "sleeping":
                if (idleAnimationFrame < 8) {
                    setSprite("tired", 0);
                    break;
                }
                setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
                if (idleAnimationFrame > 192) {
                    resetIdleAnimation();
                }
                break;
            case "scratch":
                setSprite("scratch", idleAnimationFrame);
                if (idleAnimationFrame > 9) {
                    resetIdleAnimation();
                }
                break;
            default:
                setSprite("idle", 0);
                return;
        }
        idleAnimationFrame += 1;
    }

    function frame() {
        frameCount += 1;
        const diffX = nekoPosX - mousePosX;
        const diffY = nekoPosY - mousePosY;
        const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

        if (distance < nekoSpeed || distance < 48) {
            idle();
            return;
        }

        idleAnimation = null;
        idleAnimationFrame = 0;

        if (idleTime > 1) {
            setSprite("alert", 0);
            idleTime = Math.min(idleTime, 7);
            idleTime -= 1;
            return;
        }

        let direction = diffY / distance > 0.5 ? "N" : "";
        direction += diffY / distance < -0.5 ? "S" : "";
        direction += diffX / distance > 0.5 ? "W" : "";
        direction += diffX / distance < -0.5 ? "E" : "";
        setSprite(direction, frameCount);

        nekoPosX -= (diffX / distance) * nekoSpeed;
        nekoPosY -= (diffY / distance) * nekoSpeed;

        nekoEl.style.left = `${nekoPosX - 16}px`;
        nekoEl.style.top = `${nekoPosY - 16}px`;
    }

    create();
})();
