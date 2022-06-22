import request from "../utils/request";

export function getNotes(params = {}) {
    return request({
        method: "GET",
        url: "/notes",
        params,
    });
}


export function deleteNote(id) {
    return request({
        method: 'DELETE',
        url: `/notes/${id}`
    })
}

export function getNote(id) {
    return request({
        method: "GET",
        url: `/notes/${id}`,
    })
}

export function createNote(data) {
    return request({
        method: 'POST',
        url: '/notes',
        data,
    })
}

export function updateNote(id, data) {
    return request({
        method: 'PUT',
        url: `/notes/${id}`,
        data,
    })
}

export function batchNote(ids) {
    return request({
        method: 'POST',
        url: `/notes/batch-delete`,
        data: {
            ids,
        }
    })
}