export const domain = 'http://imageobject.seodogs.ru';
export const defaultData = { jsonrpc: '2.0', method: 'set_img', id: 1, params: [] };
export const imgUrl = `${domain}/schema/schemaImg_1.jpg?nocache=${Math.floor(Math.random() * 10000000)}`;

export function fetchData(url, options) {
    return fetch(`${domain}/${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        ...options
    })
}
