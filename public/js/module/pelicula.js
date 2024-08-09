let data = await fetch(`${location.href}/all`)
document.querySelector("pre").innerHTML = JSON.stringify(await data.json(), null, 4)