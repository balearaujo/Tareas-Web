
import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller';

const router: any = Router();
const controller: any = new ProductsController();

router.get('/getAll', (req: any, res: any) => controller.getAll(req, res));
router.get('/getById/:id', (req: any, res: any) => controller.getById(req, res));
router.post('/create', (req: any, res: any) => controller.create(req, res));
router.put('/update/:id', (req: any, res: any) => controller.update(req, res));
router.delete('/delete/:id', (req: any, res: any) => controller.delete(req, res));
router.patch('/change-price/:id', (req: any, res: any) => controller.changePrice(req, res));

export default router;