import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }

    get client() {
        return this.supabase;
    }

    /**
     * Upload an image to Supabase Storage and return its public URL.
     */
    async uploadProductImage(file: File, productId: string, folder: string = 'base'): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${productId}/${folder}/${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

        const { data, error } = await this.supabase.storage
            .from('product-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            throw error;
        }

        const { data: publicUrlData } = this.supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    }
}
