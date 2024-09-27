interface Etiqueta {
    id: number;
    evento_id: number;
    etiqueta: string;
    created_at: string;
    updated_at: string;
}

interface Url {
    id: number;
    evento_id: number;
    id_url: number;
    url: string;
}

interface Vista {
    id: number;
    nombre: string;
    fecha: string;
    fecha_formateada: string;
}

interface Categoria {
    id: number;
    categoria: string;
    imagen: string;
    created_at: string;
    updated_at: string;
}

export interface Evento {
    id: number;
    user_id: number;
    titulo: string;
    direccion: string;
    lat: string;
    lng: string;
    categoria_id: number;
    etiquetas: Etiqueta[];
    fecha: string;
    fecha_final: string;
    precio: number;
    descripcion: string;
    foto_portada: string;
    codigo_descuento: string;
    email: string;
    telefono: string;
    created_at: string;
    updated_at: string;
    coleccion: null | string;
    fecha_format: string;
    fecha_final_format: string;
    informacion_extra: any[];
    urls: Url[];
    likes: any[];
    marcado_favorito_por: any[];
    vistas: Vista[];
    categoria: Categoria;
}