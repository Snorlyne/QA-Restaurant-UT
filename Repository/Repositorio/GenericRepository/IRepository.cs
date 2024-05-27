using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositorio.GenericRepository
{
    public interface IRepository<TEntity> where TEntity : class
    {
        Task<List<TEntity>> ObtieneLista();
        Task<List<TEntity>> ObtieneLista(Expression<Func<TEntity, bool>> lambda);
        Task<List<TType>> ObtieneLista<TType>(Expression<Func<TEntity, TType>> select) where TType : class;
        Task<List<TType>> ObtieneLista<TType>(Expression<Func<TEntity, bool>> lambda, Expression<Func<TEntity, TType>> select) where TType : class;
        Task<TEntity> BuscarPorId(int? id);
        Task<TEntity> BuscarUnElemento(Expression<Func<TEntity, bool>> lambda);
        Task<bool> ExisteElemento(Expression<Func<TEntity, bool>> lambda);
        Task<TType> BuscarUnElemento<TType>(Expression<Func<TEntity, bool>> lambda, Expression<Func<TEntity, TType>> select) where TType : class;
        Task<int> Crear(TEntity entity);
        Task<int> Actualizar(TEntity entity);
        Task<int> Eliminar(int? id);
    }
}
