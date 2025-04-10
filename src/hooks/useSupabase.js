import { useState } from 'react';
import { supabase } from '../supabaseClient';

export function useSupabaseQuery() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const execute = async (queryFn) => {
    try {
      setLoading(true);
      setError(null);
      const result = await queryFn(supabase);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { execute, loading, error };
}

export function useMochilas(userId) {
  const { execute, loading, error } = useSupabaseQuery();
  
  const fetchMochilas = async () => {
    return execute(async (supabase) => {
      const { data, error } = await supabase
        .from('mochilas')
        .select('*')
        .eq('user_id', userId)
        .order('criado_em', { ascending: false });
        
      if (error) throw error;
      return data || [];
    });
  };
  
  const addMochila = async (nome) => {
    return execute(async (supabase) => {
      const novoItem = {
        nome,
        user_id: userId,
        criado_em: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('mochilas')
        .insert([novoItem])
        .select('*')
        .single();
        
      if (error) throw error;
      return data;
    });
  };
  
  return { fetchMochilas, addMochila, loading, error };
}

export function useItems(mochilaId) {
  const { execute, loading, error } = useSupabaseQuery();
  
  const fetchItems = async () => {
    return execute(async (supabase) => {
      const { data, error } = await supabase
        .from('itens')
        .select('*')
        .eq('mochila_id', mochilaId)
        .order('nome');
        
      if (error) throw error;
      return data || [];
    });
  };
  
  const addItem = async (item) => {
    return execute(async (supabase) => {
      console.log("Executando addItem com:", item, "para mochila:", mochilaId);
      
      // Check if item exists
      const { data: existingItems, error: queryError } = await supabase
        .from('itens')
        .select('*')
        .eq('mochila_id', mochilaId)
        .ilike('nome', item.nome);
        
      if (queryError) {
        console.error("Erro ao verificar item existente:", queryError);
        throw queryError;
      }
      
      console.log("Itens existentes:", existingItems);
      
      if (existingItems && existingItems.length > 0) {
        const existingItem = existingItems[0];
        const newQuantidade = parseInt(existingItem.quantidade) + parseInt(item.quantidade);
        
        const updateData = {
          quantidade: newQuantidade
        };
        
        if (item.validade) {
          updateData.validade = item.validade;
        }
        
        console.log("Atualizando item existente:", existingItem.id, "com:", updateData);
        
        const { data: updatedItem, error: updateError } = await supabase
          .from('itens')
          .update(updateData)
          .eq('id', existingItem.id)
          .select()
          .single();
          
        if (updateError) {
          console.error("Erro ao atualizar item:", updateError);
          throw updateError;
        }
        
        console.log("Item atualizado:", updatedItem);
        return updatedItem;
      } else {
        console.log("Inserindo novo item:", { ...item, mochila_id: mochilaId });
        
        const { data, error: insertError } = await supabase
          .from('itens')
          .insert([{ ...item, mochila_id: mochilaId }])
          .select()
          .single();
          
        if (insertError) {
          console.error("Erro ao inserir item:", insertError);
          throw insertError;
        }
        
        console.log("Novo item inserido:", data);
        return data;
      }
    });
  };
  
  const updateItem = async (itemId, updates) => {
    return execute(async (supabase) => {
      const { error } = await supabase
        .from('itens')
        .update(updates)
        .eq('id', itemId);
        
      if (error) throw error;
      
      const { data, error: fetchError } = await supabase
        .from('itens')
        .select('*')
        .eq('id', itemId)
        .single();
        
      if (fetchError) throw fetchError;
      return data;
    });
  };
  
  const deleteItem = async (itemId) => {
    return execute(async (supabase) => {
      const { error } = await supabase
        .from('itens')
        .delete()
        .eq('id', itemId);
        
      if (error) throw error;
      return true;
    });
  };
  
  return { fetchItems, addItem, updateItem, deleteItem, loading, error };
}