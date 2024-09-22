// src/services/api/Axios.ts

import axios, { AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:44359/api', // Replace with your actual base URL
  timeout: 10000, // Optional: specify a timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// TypeScript function signatures with types
export const getData = async <T>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
  try {
    const response = await api.get<T>(url, config);
    return response.data;
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
};

export const postData = async <T>(url: string, data: any, config: AxiosRequestConfig = {}): Promise<T> => {
  try {
    const response = await api.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
};

export const putData = async <T>(url: string, data: any, config: AxiosRequestConfig = {}): Promise<T> => {
  try {
    const response = await api.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    console.error('PUT request error:', error);
    throw error;
  }
};

export const deleteData = async <T>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
  try {
    const response = await api.delete<T>(url, config);
    return response.data;
  } catch (error) {
    console.error('DELETE request error:', error);
    throw error;
  }
};

export default api;
