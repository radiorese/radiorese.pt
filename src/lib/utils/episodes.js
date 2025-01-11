

export async function formatMediaType(mediaType){
    let string = 'Desconhecido';

    if (mediaType = 'music') {
        string = 'Música';
    } else if (mediaType = 'podcast') {
        string = 'Rubrica';
    } 

    return string;
}