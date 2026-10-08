import { Request, Response } from 'express';
import { pool } from '../conf/dbConections';

export class ProductsController {

  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const [rows]: any = await pool.query(
        'SELECT * FROM products WHERE active = TRUE'
      );
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return res.status(500).json({message: 'Error interno del servidor' });
    }
  }


  async getById(req: Request, res: Response): Promise<any> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {//comprobar que sea entero
        return res.status(400).json({message: 'El ID debe ser positivo' });
      }

      const [rows]: any = await pool.query(
        'SELECT * FROM products WHERE id = ? AND active = TRUE',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({message: 'Producto no encontrado'});
      }

      return res.status(200).json({ success: true, data: rows[0]});
    } catch (error: any) {
      console.error('Error al obtener producto por ID:', error);
      return res.status(500).json({message: 'Error' });
    }
  }

  async create(req: Request, res: Response): Promise<any> {
    try {
      const { name, price, stock, description, brand, img }: any = req.body;

      if (!name || price === undefined || stock === undefined || !description) {
        return res.status(400).json({message: 'Los campos nombre, precio y descripcion son obligatorios'
        });
      }

      const numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({message: 'El precio debe ser mayor a 0' });
      }

      const numericStock = Number(stock);
      if (isNaN(numericStock) || numericStock < 0 || !Number.isInteger(numericStock)) {
        return res.status(400).json({message: 'El stock debe ser un número entero mayor o igual a 0' });
      }

      const [result]: any = await pool.query(
        'INSERT INTO products (name, price, stock, description, brand, img) VALUES (?, ?, ?, ?, ?, ?)',
        [name, numericPrice, numericStock, description, brand || null, img || null]
      );

      return res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: {
          id: result.insertId,
          name,
          price: numericPrice,
          stock: numericStock,
          description,
          brand: brand || null,
          img: img || null,
          active: true
        }
      });
    } catch (error: any) {
      console.error('Error al crear producto:', error);
      return res.status(500).json({message: 'Error' });
    }
  }

  async update(req: Request, res: Response): Promise<any> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
        return res.status(400).json({ message: 'El ID debe ser un entero positivo' });
      }

      const { name, price, stock, description, brand, img }: any = req.body;

      if (!name || price === undefined || stock === undefined || !description) {
        return res.status(400).json({ message: 'Los campos nombre precio y descripcion son obligatorios'});
      }

      const numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({message: 'El precio debe ser un número mayor a 0' });
      }

      const numericStock = Number(stock);
      if (isNaN(numericStock) || numericStock < 0 || !Number.isInteger(numericStock)) {
        return res.status(400).json({ message: 'El stock debe ser un número mayor a 0' });
      }

      const [result]: any = await pool.query(
        'UPDATE products SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? WHERE id = ? AND active = TRUE',
        [name, numericPrice, numericStock, description, brand || null, img || null, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({message: 'Producto no encontrado/inactivo' });
      }

      return res.status(200).json({
        success: true,
        message: 'Producto actualizado'
      });
    } catch (error: any) {
      console.error('Error al actualizar producto:', error);
      return res.status(500).json({ success: false, message: 'Error' });
    }
  }


  async delete(req: Request, res: Response): Promise<any> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
        return res.status(400).json({ success: false, message: 'El ID debe ser positivo' });
      }

      const [result]: any = await pool.query(
        'UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({message: 'Producto no encontrado o ya inactivo' });
      }

      return res.status(200).json({
        success: true,
        message: 'Producto dado de baja lógicamente'
      });
    } catch (error: any) {
      console.error('Error al eliminar producto:', error);
      return res.status(500).json({message: 'Error' });
    }
  }

  async changePrice(req: Request, res: Response): Promise<any> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
        return res.status(400).json({message: 'El ID debe ser un positivo' });
      }

      const { price }: any = req.body;
      const numericPrice = Number(price);

      if (price === undefined || isNaN(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({ message: 'El precio debe ser un número mayor a 0' });
      }

      const [result]: any = await pool.query(
        'UPDATE products SET price = ? WHERE id = ? AND active = TRUE',
        [numericPrice, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({message: 'Producto no encontrado/inactivo' });
      }

      return res.status(200).json({message: 'Precio modificado'
      });
    } catch (error) {
      console.error('Error al cambiar el precio:', error);
      return res.status(500).json({message: 'Error' });
    }
  }
}

