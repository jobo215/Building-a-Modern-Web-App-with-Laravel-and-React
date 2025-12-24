<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{

    public function __construct()
    {
        $this->middleware("auth:api", ['except' => ['login', 'register']]);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if ($token = auth('api')->attempt($credentials)) {
            return $this->respondWithToken($token, 200);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    public function register(Request $request): JsonResponse
    {
        $request->validate([
            "email" => "required|string|email|max:255|unique:users",
            "password" => "required|string|min:6|confirmed",
            "first_name" => "required|string|max:255",
            "last_name" => "required|string|max:255",
        ]);
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'image' => null,
            'bio' => null
        ]);

        $token = auth('api')->login($user);

        return $this->respondWithToken($token, 201);
    }

    public function update(Request $request): JsonResponse
    {
        $user = Auth::user();

        $rules = [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'bio' => 'sometimes|nullable|string',
        ];

        if ($request->hasFile('avatar')) {
            $rules['avatar'] = 'required|image|max:2048';
        }

        $validatedData = $request->validate($rules);

        $dataToUpdate = $validatedData;

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $disk = 'r2';

            $fileName = $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();

            $path = Storage::disk($disk)->putFileAs(
                'avatars',
                $file,
                $fileName,
                'public'
            );

            $dataToUpdate['image'] = $path;
        } else {
            unset($dataToUpdate['image']);
        }

        $user->update($dataToUpdate);

        return response()->json([
            'message' => 'Profile updated successfully!',
            'user' => $user->fresh()->only([
                'id',
                'first_name',
                'last_name',
                'email',
                'bio',
                'image'
            ]),
        ]);
    }

    public function me(): JsonResponse
    {
        return response()->json(auth('api')->user());
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(["message" => "Unauthorized"], 401);
        }

        $file = $request->file("avatar");

        $path = Storage::disk('gsc')->putFileAs(
            'avatars',
            $file,
            $user->id . '_' . time() . '.' . $file->getClientOriginalExtension()
        );

        $url = Storage::disk('gsc')->url($path);

        return response()->json(['url' => $url]);
    }

    protected function respondWithToken(string $token, int $statusCode): JsonResponse
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => auth('api')->user(),
        ], $statusCode);
    }

}
