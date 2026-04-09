from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour permettre uniquement aux propriétaires d'un objet de le modifier.
    """
    def has_object_permission(self, request, view, obj):
        # Les permissions de lecture sont autorisées pour n'importe quelle requête,
        # donc nous autorisons toujours les requêtes GET, HEAD ou OPTIONS.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Le profil appartient à l'utilisateur si obj.user == request.user
        return obj.user == request.user
