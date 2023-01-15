let modal

const startup = () => {    
    modal = document.getElementById('modal')
}

const parts = [
    {key:'motherboard', value:{
        image:'https://dlcdnwebimgs.asus.com/gain/1a1feeca-5a98-4183-bfde-b25e314f58c6/w328',
        header: 'Hovedkort',
        desc: 'Hovedkort er kretskortet som knytter alle de sentrale komponentene i en datamaskin sammen og som gjør at de kan kommunisere med hverandre.',
        link: 'https://no.wikipedia.org/wiki/Hovedkort',
    }},
    {key: 'cpu', value:{
        image:'https://www.pngall.com/wp-content/uploads/11/CPU-PNG-File.png',
        header: 'Prosessor',
        desc: 'En CPU (engelsk forkortelse for Central Processing Unit), også kalt prosessor, er hovedregne-/prosesseringsenheten i en datamaskin som utfører instruksjonene gitt i et dataprogram.',
        link: 'https://snl.no/CPU',
    }},
    {key: 'gpu', value:{
        image:'https://www.nvidia.com/content/dam/en-zz/Solutions/shop/1532541-gf-web-dmo-graphics-cards-3090-594x308.png',
        header: 'Grafikkprosessor',
        desc: 'Grafikkprosessor, ofte omtalt som GPU (engelsk for Graphics Processing Unit), er en spesialisert mikroprosessor som brukes til grafikkprossesering og høyytelsesberegninger.',
        link: 'https://no.wikipedia.org/wiki/Grafikkprosessor',
    }},
    {key: 'psu', value:{
        image:'https://www.gamera.no/Media/Cache/Images/1/8/WEB_Image_Corsair_PSU_CX750W_80__Bronze_PSU_750_w__31783_0-1285337172_plid_182508.Png',
        header: 'Strømforsyning',
        desc: 'Strømforsyningen er en viktig del av alle PCer da den leverer strøm til hele systemet. Strømforsyningen deles opp etter hvor mye strøm de leverer, gjerne fra 400 til 1200 watt.',
        link: 'https://no.wikipedia.org/wiki/Str%C3%B8mforsyning',
    }},
    {key: 'ram', value:{
        image:'https://anafra.eu/file/264382b899b90c9974667f6cc112c369/3060/rdim%20ano.png',
        header: 'RAM (Random Access Memory)',
        desc: 'RAM er et helelektronisk arbeidslager som benyttes til midlertidig lagring internt i en datamaskin.',
        link: 'https://snl.no/RAM_-_IT',
    }},
    {key: 'ssd', value:{
        image:'https://www.westerndigital.com/content/dam/store/en-us/assets/products/internal-storage/ssd-plus-sata-iii-ssd/gallery/ssd-plus-sata-iii-ssd-left.png.thumb.1280.1280.png',
        header: 'SSD (Solid State Drive)',
        desc: 'SSD er et lagringsmedium som benytter halvlederbasert fastminne (flashminne) som sekundærminne istedenfor mekanisk-magnetiske platelager til å lagre data.',
        link: 'https://no.wikipedia.org/wiki/Solid_state_drive',
    }},
]

const openModal = (partName) => {
    const part = parts.find(x=>x.key == partName).value
    modal.innerHTML = `
        <div class="modalcontent" id="modalcontent">
            <div class="modalclose" id="modalclose">&times;</div>
            <div class="modalimage">
                <img class="image" src="${part.image}"/>
            </div>
            <div class="modalheader">${part.header}</div>
            <div class="modaldesc">${part.desc}</div>
            <div class="modallink">
                <a class="link" href="${part.link}" target="blank_">Les mer</a>
            </div>
         </div>
        `
    const closeBtn = document.getElementById('modalclose')
    closeBtn.addEventListener('click', (e) => closeModal(e))

    const modalcontent = document.getElementById('modalcontent')
    modalcontent.addEventListener('click', e => e.cancelBubble = true)
} 



const closeModal = () => {
    const modal = document.getElementById('modal')
    modal.innerHTML = ``
}