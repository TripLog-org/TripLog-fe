import { View, Text, Image, Pressable } from 'react-native';
import { Post } from '@/entities/post';

interface Props {
  post: Post;
  onPress?: () => void;
}

export function PostCard({ post, onPress }: Props) {
  const thumbnail = post.images?.[0]?.thumbnail || post.images?.[0]?.url;

  return (
    <Pressable onPress={onPress} className="mb-3 overflow-hidden rounded-xl bg-white shadow-sm">
      {thumbnail && (
        <Image
          source={{ uri: thumbnail }}
          className="h-48 w-full"
          resizeMode="cover"
        />
      )}
      <View className="p-3">
        <Text className="text-base font-semibold text-text" numberOfLines={2}>
          {post.content}
        </Text>
        {post.tags.length > 0 && (
          <View className="mt-2 flex-row flex-wrap gap-1">
            {post.tags.map((tag) => (
              <View key={tag} className="rounded-full bg-primary/10 px-2 py-0.5">
                <Text className="text-xs text-primary">#{tag}</Text>
              </View>
            ))}
          </View>
        )}
        <View className="mt-2 flex-row items-center gap-3">
          <Text className="text-xs text-text-tertiary">❤️ {post.likeCount}</Text>
          <Text className="text-xs text-text-tertiary">💬 {post.commentCount}</Text>
        </View>
      </View>
    </Pressable>
  );
}
